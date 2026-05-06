import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChurchesScreen from '../components/ChurchesScreen';

describe('ChurchesScreen', () => {
  it('renders the section heading', () => {
    render(<ChurchesScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /Nearby Churches/i })).toBeInTheDocument();
  });

  it('renders all four churches', () => {
    render(<ChurchesScreen onNavigate={vi.fn()} />);
    expect(screen.getByText("St. Mary's Parish, Navan")).toBeInTheDocument();
    expect(screen.getByText("St. Colmcille's, Kells")).toBeInTheDocument();
    expect(screen.getByText("St. Patrick's, Trim")).toBeInTheDocument();
    expect(screen.getByText('Pro-Cathedral, Dublin')).toBeInTheDocument();
  });

  it('renders church addresses', () => {
    render(<ChurchesScreen onNavigate={vi.fn()} />);
    expect(screen.getByText(/Church Hill, Navan/i)).toBeInTheDocument();
    expect(screen.getByText(/Marlborough St, Dublin/i)).toBeInTheDocument();
  });

  it('renders distances', () => {
    render(<ChurchesScreen onNavigate={vi.fn()} />);
    expect(screen.getByText('1.2 km')).toBeInTheDocument();
    expect(screen.getByText('46 km')).toBeInTheDocument();
  });

  it('renders confession time badges', () => {
    render(<ChurchesScreen onNavigate={vi.fn()} />);
    expect(screen.getByText('Sat 11:00–12:00')).toBeInTheDocument();
    expect(screen.getByText('Mon–Sat 10:00–18:30')).toBeInTheDocument();
  });

  it('renders a "Schedule a confession" button', () => {
    render(<ChurchesScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Schedule a confession/i })).toBeInTheDocument();
  });

  it('navigates to schedule screen when Schedule button is clicked', async () => {
    const onNavigate = vi.fn();
    render(<ChurchesScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: /Schedule a confession/i }));
    expect(onNavigate).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith('schedule');
  });

  it('renders churches as article elements', () => {
    const { container } = render(<ChurchesScreen onNavigate={vi.fn()} />);
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(4);
  });
});
