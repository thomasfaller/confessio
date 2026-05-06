import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppHeader from '../components/AppHeader';

describe('AppHeader', () => {
  it('renders the app title', () => {
    render(<AppHeader />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Confessio');
  });

  it('renders the subtitle', () => {
    render(<AppHeader />);
    expect(screen.getByText(/companion for the Sacrament of Reconciliation/i)).toBeInTheDocument();
  });

  it('renders inside a header element', () => {
    const { container } = render(<AppHeader />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
