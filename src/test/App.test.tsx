import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the useAnthropicAPI hook used deep inside AIExaminationScreen
vi.mock('../hooks/useAnthropicAPI', () => ({
  useAnthropicAPI: () => ({
    callClaude: vi.fn().mockResolvedValue(null),
    loading: false,
    error: null,
  }),
}));

describe('App', () => {
  it('renders the AppHeader', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /Confessio/i })).toBeInTheDocument();
  });

  it('renders the BottomNav', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  });

  it('shows HomeScreen by default', () => {
    render(<App />);
    expect(screen.getByText(/Whose sins you forgive/i)).toBeInTheDocument();
  });

  it('navigates to ChurchesScreen via BottomNav', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Churches' }));
    expect(screen.getByRole('heading', { name: /Nearby Churches/i })).toBeInTheDocument();
  });

  it('navigates to ScheduleScreen via BottomNav', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    expect(screen.getByRole('heading', { name: /Schedule your Confession/i })).toBeInTheDocument();
  });

  it('navigates to AIExaminationScreen via BottomNav', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Examine' }));
    expect(screen.getByRole('heading', { name: /AI-Guided Examination/i })).toBeInTheDocument();
  });

  it('navigates to ConfessionScreen via BottomNav', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Confess' }));
    expect(screen.getByText(/Step 1 — Preparing your heart/i)).toBeInTheDocument();
  });

  it('navigates back to HomeScreen via BottomNav Home button', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Churches' }));
    await userEvent.click(screen.getByRole('button', { name: 'Home' }));
    expect(screen.getByText(/Whose sins you forgive/i)).toBeInTheDocument();
  });

  it('navigates from HomeScreen card to ChurchesScreen', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Find a Church'));
    expect(screen.getByRole('heading', { name: /Nearby Churches/i })).toBeInTheDocument();
  });

  it('navigates from HomeScreen card to ScheduleScreen', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    expect(screen.getByRole('heading', { name: /Schedule your Confession/i })).toBeInTheDocument();
  });

  it('navigates from HomeScreen card to AIExaminationScreen', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('AI Examination'));
    expect(screen.getByRole('heading', { name: /AI-Guided Examination/i })).toBeInTheDocument();
  });

  it('navigates from HomeScreen card to ConfessionScreen', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Guide Me'));
    expect(screen.getByText(/Step 1 — Preparing your heart/i)).toBeInTheDocument();
  });

  it('marks the active BottomNav item with aria-current="page"', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Churches' }));
    const btn = screen.getByRole('button', { name: 'Churches' });
    expect(btn).toHaveAttribute('aria-current', 'page');
    const homeBtn = screen.getByRole('button', { name: 'Home' });
    expect(homeBtn).not.toHaveAttribute('aria-current');
  });

  it('navigates from ChurchesScreen to ScheduleScreen via Schedule button', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Churches' }));
    await userEvent.click(screen.getByRole('button', { name: /Schedule a confession/i }));
    expect(screen.getByRole('heading', { name: /Schedule your Confession/i })).toBeInTheDocument();
  });
});
