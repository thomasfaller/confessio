import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomeScreen from '../components/HomeScreen';

describe('HomeScreen', () => {
  it('renders the scripture quote', () => {
    render(<HomeScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/Whose sins you forgive/i)).toBeInTheDocument();
  });

  it('renders scripture reference', () => {
    render(<HomeScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/John 20:23/i)).toBeInTheDocument();
  });

  it('renders all four action cards', () => {
    render(<HomeScreen onNavigate={vi.fn()} />);
    expect(screen.getByText('Find a Church')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('AI Examination')).toBeInTheDocument();
    expect(screen.getByText('Guide Me')).toBeInTheDocument();
  });

  it('navigates to churches screen when Find a Church is clicked', async () => {
    const onNavigate = vi.fn();
    render(<HomeScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText('Find a Church'));
    expect(onNavigate).toHaveBeenCalledWith('churches');
  });

  it('navigates to schedule screen when Schedule is clicked', async () => {
    const onNavigate = vi.fn();
    render(<HomeScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText('Schedule'));
    expect(onNavigate).toHaveBeenCalledWith('schedule');
  });

  it('navigates to ai-exam screen when AI Examination is clicked', async () => {
    const onNavigate = vi.fn();
    render(<HomeScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText('AI Examination'));
    expect(onNavigate).toHaveBeenCalledWith('ai-exam');
  });

  it('navigates to confession screen when Guide Me is clicked', async () => {
    const onNavigate = vi.fn();
    render(<HomeScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText('Guide Me'));
    expect(onNavigate).toHaveBeenCalledWith('confession');
  });

  it('renders card descriptions', () => {
    render(<HomeScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/Confession times near you/i)).toBeInTheDocument();
    expect(screen.getByText(/Personalised conscience guide/i)).toBeInTheDocument();
    expect(screen.getByText(/Step-by-step through the sacrament/i)).toBeInTheDocument();
  });
});
