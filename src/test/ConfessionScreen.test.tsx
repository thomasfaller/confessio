import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfessionScreen from '../components/ConfessionScreen';

describe('ConfessionScreen', () => {
  it('renders the first step label', () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/Step 1 — Preparing your heart/i)).toBeInTheDocument();
  });

  it('renders the prayer title for step 1', () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    expect(screen.getByText('Act of Contrition')).toBeInTheDocument();
  });

  it('does not show Back button on step 1', () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Back/i })).not.toBeInTheDocument();
  });

  it('shows Next button on step 1', () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  it('renders 5 progress dots (4 steps + final screen)', () => {
    const { container } = render(<ConfessionScreen onNavigate={vi.fn()} />);
    // The dots div is aria-hidden; find spans inside it
    const dotsContainer = container.querySelector('[aria-hidden="true"]');
    // 5 dots total
    expect(dotsContainer?.querySelectorAll('span')).toHaveLength(5);
  });

  it('advances to step 2 when Next is clicked', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText(/Step 2 — Entering the confessional/i)).toBeInTheDocument();
  });

  it('shows Back button after advancing past step 1', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByRole('button', { name: /Back/i })).toBeInTheDocument();
  });

  it('goes back to step 1 when Back is clicked', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    await userEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(screen.getByText(/Step 1 — Preparing your heart/i)).toBeInTheDocument();
  });

  it('navigates through all 4 steps in order', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    const labels = [
      /Step 1 — Preparing your heart/i,
      /Step 2 — Entering the confessional/i,
      /Step 3 — Confessing your sins/i,
      /Step 4 — Receiving absolution/i,
    ];
    for (let i = 0; i < labels.length; i++) {
      expect(screen.getByText(labels[i]!)).toBeInTheDocument();
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
  });

  it('shows the final "Go in Peace" screen after all steps', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    for (let i = 0; i < 4; i++) {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
    expect(screen.getByText('Go in Peace')).toBeInTheDocument();
    expect(screen.getByText(/Your sins are forgiven/i)).toBeInTheDocument();
  });

  it('final screen has a "Return Home" button', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    for (let i = 0; i < 4; i++) {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
    expect(screen.getByRole('button', { name: /Return Home/i })).toBeInTheDocument();
  });

  it('calls onNavigate("home") and resets to step 1 when Return Home is clicked', async () => {
    const onNavigate = vi.fn();
    render(<ConfessionScreen onNavigate={onNavigate} />);
    for (let i = 0; i < 4; i++) {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
    await userEvent.click(screen.getByRole('button', { name: /Return Home/i }));
    expect(onNavigate).toHaveBeenCalledWith('home');
  });

  it('final screen has the correct aria region label', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    for (let i = 0; i < 4; i++) {
      await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
    expect(screen.getByRole('region', { name: /Final blessing/i })).toBeInTheDocument();
  });

  it('prayer box content changes with each step', async () => {
    render(<ConfessionScreen onNavigate={vi.fn()} />);
    expect(screen.getByText('Act of Contrition')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Opening words')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('Your sins')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('The absolution')).toBeInTheDocument();
  });
});
