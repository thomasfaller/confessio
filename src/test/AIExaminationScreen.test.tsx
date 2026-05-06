import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIExaminationScreen from '../components/AIExaminationScreen';

// Helper: mock the useAnthropicAPI hook
vi.mock('../hooks/useAnthropicAPI', () => ({
  useAnthropicAPI: vi.fn(),
}));

import { useAnthropicAPI } from '../hooks/useAnthropicAPI';

const mockUseAnthropicAPI = vi.mocked(useAnthropicAPI as () => {
  callClaude: (prompt: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
});

function makeHookImpl(overrides: Partial<{
  callClaude: (prompt: string) => Promise<unknown>;
  loading: boolean;
  error: string | null;
}> = {}) {
  return {
    callClaude: vi.fn().mockResolvedValue(null),
    loading: false,
    error: null,
    ...overrides,
  };
}

describe('AIExaminationScreen — form rendering', () => {
  beforeEach(() => {
    mockUseAnthropicAPI.mockReturnValue(makeHookImpl());
  });

  it('renders the section heading', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /AI-Guided Examination/i })).toBeInTheDocument();
  });

  it('renders the "State of life" select', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByLabelText(/State of life/i)).toBeInTheDocument();
  });

  it('renders the "Time since last confession" select', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByLabelText(/Time since last confession/i)).toBeInTheDocument();
  });

  it('renders the "Area of focus" select', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByLabelText(/Area of focus/i)).toBeInTheDocument();
  });

  it('renders the "Depth" select', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByLabelText(/Depth/i)).toBeInTheDocument();
  });

  it('renders the Generate button', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Generate my examination/i })).toBeInTheDocument();
  });

  it('does not show a loading indicator initially', () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.queryByText(/Preparing your examination/i)).not.toBeInTheDocument();
  });

  it('displays an error message from the hook', () => {
    mockUseAnthropicAPI.mockReturnValue(makeHookImpl({ error: 'No API key configured.' }));
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/No API key configured/i)).toBeInTheDocument();
  });
});

describe('AIExaminationScreen — loading state', () => {
  it('shows loading indicator while loading', () => {
    mockUseAnthropicAPI.mockReturnValue(makeHookImpl({ loading: true }));
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/Preparing your examination/i)).toBeInTheDocument();
  });

  it('hides the form while loading', () => {
    mockUseAnthropicAPI.mockReturnValue(makeHookImpl({ loading: true }));
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Generate my examination/i })).not.toBeInTheDocument();
  });
});

describe('AIExaminationScreen — results', () => {
  const MOCK_RESULT = {
    categories: [
      { title: 'Charity', questions: ['Did you love your neighbour?', 'Did you forgive others?'] },
      { title: 'Prayer', questions: ['Did you pray daily?'] },
    ],
  };

  beforeEach(() => {
    mockUseAnthropicAPI.mockReturnValue(
      makeHookImpl({ callClaude: vi.fn().mockResolvedValue(MOCK_RESULT) })
    );
  });

  it('displays categories and questions after generation', async () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => {
      expect(screen.getByText('Charity')).toBeInTheDocument();
      expect(screen.getByText('Did you love your neighbour?')).toBeInTheDocument();
      expect(screen.getByText('Prayer')).toBeInTheDocument();
    });
  });

  it('hides the form after results are shown', async () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => expect(screen.getByText('Charity')).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /Generate my examination/i })).not.toBeInTheDocument();
  });

  it('toggles a question checked state when clicked', async () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => expect(screen.getByText('Did you love your neighbour?')).toBeInTheDocument());

    const item = screen.getByText('Did you love your neighbour?').closest('[role="button"]')!;
    expect(item).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(item);
    expect(item).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(item);
    expect(item).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles a question via keyboard Enter', async () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => expect(screen.getByText('Did you pray daily?')).toBeInTheDocument());

    const item = screen.getByText('Did you pray daily?').closest('[role="button"]')!;
    item.focus();
    await userEvent.keyboard('{Enter}');
    expect(item).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard(' ');
    expect(item).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows "Begin the Sacrament" and "Generate a new examination" buttons in results', async () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => expect(screen.getByText('Charity')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Begin the Sacrament/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate a new examination/i })).toBeInTheDocument();
  });

  it('navigates to confession when "Begin the Sacrament" is clicked', async () => {
    const onNavigate = vi.fn();
    render(<AIExaminationScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => expect(screen.getByText('Charity')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /Begin the Sacrament/i }));
    expect(onNavigate).toHaveBeenCalledWith('confession');
  });

  it('resets to form when "Generate a new examination" is clicked', async () => {
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    await waitFor(() => expect(screen.getByText('Charity')).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /Generate a new examination/i }));
    expect(screen.getByRole('button', { name: /Generate my examination/i })).toBeInTheDocument();
  });
});

describe('AIExaminationScreen — null response', () => {
  it('does not show results when API returns null', async () => {
    mockUseAnthropicAPI.mockReturnValue(
      makeHookImpl({ callClaude: vi.fn().mockResolvedValue(null) })
    );
    render(<AIExaminationScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Generate my examination/i }));
    // Should not crash and form may reappear or stay hidden; no result categories shown
    expect(screen.queryByText('Charity')).not.toBeInTheDocument();
  });
});
