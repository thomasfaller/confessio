import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BottomNav from '../components/BottomNav';

const NAV_ITEMS = [
  { screen: 'home' as const,      label: 'Home' },
  { screen: 'churches' as const,  label: 'Churches' },
  { screen: 'ai-exam' as const,   label: 'Examine' },
  { screen: 'schedule' as const,  label: 'Schedule' },
  { screen: 'confession' as const, label: 'Confess' },
];

describe('BottomNav', () => {
  it('renders all five navigation buttons', () => {
    render(<BottomNav current="home" onNavigate={vi.fn()} />);
    NAV_ITEMS.forEach(({ label }) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('renders a nav landmark with aria-label', () => {
    render(<BottomNav current="home" onNavigate={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
  });

  it.each(NAV_ITEMS)('marks $label button as aria-current="page" when active', ({ screen: s, label }) => {
    render(<BottomNav current={s} onNavigate={vi.fn()} />);
    const btn = screen.getByText(label).closest('button');
    expect(btn).toHaveAttribute('aria-current', 'page');
  });

  it.each(NAV_ITEMS)('does not mark inactive $label button as aria-current', ({ screen: s, label }) => {
    const other = NAV_ITEMS.find(n => n.screen !== s)!;
    render(<BottomNav current={other.screen} onNavigate={vi.fn()} />);
    const btn = screen.getByText(label).closest('button');
    expect(btn).not.toHaveAttribute('aria-current');
  });

  it('calls onNavigate with the correct screen when a button is clicked', async () => {
    const onNavigate = vi.fn();
    render(<BottomNav current="home" onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText('Churches'));
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith('churches');
  });

  it('calls onNavigate for each nav item when clicked', async () => {
    const onNavigate = vi.fn();
    render(<BottomNav current="home" onNavigate={onNavigate} />);
    for (const { label, screen: s } of NAV_ITEMS) {
      onNavigate.mockClear();
      await userEvent.click(screen.getByText(label));
      expect(onNavigate).toHaveBeenCalledWith(s);
    }
  });
});
