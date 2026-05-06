import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnthropicAPI } from '../hooks/useAnthropicAPI';

const MOCK_RESPONSE = {
  categories: [
    { title: 'Test', questions: ['Question 1?'] },
  ],
};

function makeFetchOk(body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({
      content: [{ text: JSON.stringify(body) }],
    }),
    text: vi.fn().mockResolvedValue(''),
  });
}

function makeFetchError(status: number, text = '') {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    text: vi.fn().mockResolvedValue(text),
    json: vi.fn(),
  });
}

describe('useAnthropicAPI', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubEnv('VITE_ANTHROPIC_API_KEY', 'test-key-123');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('starts with loading=false and error=null', () => {
    const { result } = renderHook(() => useAnthropicAPI());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error and returns null when no API key is configured', async () => {
    vi.stubEnv('VITE_ANTHROPIC_API_KEY', '');
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('test prompt');
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(response).toBeNull();
    expect(result.current.error).toMatch(/No Anthropic API key/i);
  });

  it('returns parsed JSON on a successful API call', async () => {
    global.fetch = makeFetchOk(MOCK_RESPONSE);
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('hello');
    });
    expect(response).toEqual(MOCK_RESPONSE);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets loading to true during the API call', async () => {
    let resolveFetch!: (v: unknown) => void;
    global.fetch = vi.fn().mockReturnValue(
      new Promise(resolve => { resolveFetch = resolve; })
    );

    const { result } = renderHook(() => useAnthropicAPI());
    act(() => { void result.current.callClaude('prompt'); });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFetch({
        ok: true,
        json: vi.fn().mockResolvedValue({ content: [{ text: JSON.stringify(MOCK_RESPONSE) }] }),
        text: vi.fn().mockResolvedValue(''),
      });
    });
    expect(result.current.loading).toBe(false);
  });

  it('sets error and returns null on non-ok API response', async () => {
    global.fetch = makeFetchError(401, 'Unauthorized');
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('prompt');
    });
    expect(response).toBeNull();
    expect(result.current.error).toMatch(/API error 401/);
    expect(result.current.loading).toBe(false);
  });

  it('sets error and returns null when response JSON is invalid', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        content: [{ text: 'not valid json {{{{' }],
      }),
      text: vi.fn().mockResolvedValue(''),
    });
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('prompt');
    });
    expect(response).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.loading).toBe(false);
  });

  it('strips markdown code fences before parsing JSON', async () => {
    const jsonWithFences = '```json\n' + JSON.stringify(MOCK_RESPONSE) + '\n```';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ content: [{ text: jsonWithFences }] }),
      text: vi.fn().mockResolvedValue(''),
    });
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('prompt');
    });
    expect(response).toEqual(MOCK_RESPONSE);
    expect(result.current.error).toBeNull();
  });

  it('sets error and returns null when fetch itself throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network failure'));
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('prompt');
    });
    expect(response).toBeNull();
    expect(result.current.error).toBe('Network failure');
    expect(result.current.loading).toBe(false);
  });

  it('handles concatenated text blocks from the API', async () => {
    const part1 = '{"categories":[{"title":"A","questions":["Q';
    const part2 = '1?"]}]}';
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        content: [{ text: part1 }, { text: part2 }],
      }),
      text: vi.fn().mockResolvedValue(''),
    });
    const { result } = renderHook(() => useAnthropicAPI());
    let response: unknown;
    await act(async () => {
      response = await result.current.callClaude('prompt');
    });
    expect(response).toEqual({ categories: [{ title: 'A', questions: ['Q1?'] }] });
  });

  it('resets error on a subsequent successful call', async () => {
    global.fetch = makeFetchError(500, 'Server error');
    const { result } = renderHook(() => useAnthropicAPI());
    await act(async () => { await result.current.callClaude('prompt'); });
    expect(result.current.error).toBeTruthy();

    global.fetch = makeFetchOk(MOCK_RESPONSE);
    await act(async () => { await result.current.callClaude('prompt'); });
    expect(result.current.error).toBeNull();
  });

  it('sends a POST to the Anthropic API URL with correct headers', async () => {
    global.fetch = makeFetchOk(MOCK_RESPONSE);
    const { result } = renderHook(() => useAnthropicAPI());
    await act(async () => { await result.current.callClaude('test prompt'); });
    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(options.method).toBe('POST');
    expect(options.headers['x-api-key']).toBe('test-key-123');
    expect(options.headers['anthropic-version']).toBe('2023-06-01');
  });

  it('sends the prompt as a user message in the request body', async () => {
    global.fetch = makeFetchOk(MOCK_RESPONSE);
    const { result } = renderHook(() => useAnthropicAPI());
    await act(async () => { await result.current.callClaude('my prompt text'); });
    const body = JSON.parse((global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.messages).toEqual([{ role: 'user', content: 'my prompt text' }]);
  });
});

