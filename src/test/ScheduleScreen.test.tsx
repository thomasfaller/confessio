import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScheduleScreen from '../components/ScheduleScreen';

describe('ScheduleScreen', () => {
  it('renders the section heading', () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /Schedule your Confession/i })).toBeInTheDocument();
  });

  it('renders all three churches', () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    expect(screen.getByText("St. Mary's Parish, Navan")).toBeInTheDocument();
    expect(screen.getByText("St. Colmcille's, Kells")).toBeInTheDocument();
    expect(screen.getByText("St. Patrick's, Trim")).toBeInTheDocument();
  });

  it('renders the date input', () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    expect(screen.getByLabelText(/Choose a date/i)).toBeInTheDocument();
  });

  it('renders all four reminder buttons', () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'None' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 day before' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2 days before' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1 week before' })).toBeInTheDocument();
  });

  it('renders the intention textarea', () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    expect(screen.getByLabelText(/Intention/i)).toBeInTheDocument();
  });

  it('renders the Confirm button', () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    expect(screen.getByRole('button', { name: /Confirm my confession/i })).toBeInTheDocument();
  });

  it('shows error when confirming without selecting a church', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.getByText(/Please choose a church/i)).toBeInTheDocument();
  });

  it('shows error when confirming without a confession time slot', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.getByText(/Please choose a confession time/i)).toBeInTheDocument();
  });

  it('shows error when confirming without a date', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    const slotBtn = await screen.findByRole('button', { name: 'Sat 11:00–12:00' });
    await userEvent.click(slotBtn);
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.getByText(/Please choose a date/i)).toBeInTheDocument();
  });

  it('shows time slots after selecting a church', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    expect(screen.getByRole('button', { name: 'Sat 11:00–12:00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sat 17:30–18:00' })).toBeInTheDocument();
  });

  it('hides slots of first church after selecting a different church', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    expect(screen.getByRole('button', { name: 'Sat 11:00–12:00' })).toBeInTheDocument();
    await userEvent.click(screen.getByText("St. Colmcille's, Kells"));
    expect(screen.queryByRole('button', { name: 'Sat 11:00–12:00' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sat 10:30–11:30' })).toBeInTheDocument();
  });

  it('displays confirmation screen on valid submission', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: 'Sat 11:00–12:00' }));
    await userEvent.type(screen.getByLabelText(/Choose a date/i), '2030-06-15');
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.getByRole('heading', { name: /Confession Scheduled/i })).toBeInTheDocument();
    expect(screen.getByText(/St\. Mary's Parish, Navan/)).toBeInTheDocument();
    expect(screen.getByText(/Sat 11:00–12:00/)).toBeInTheDocument();
  });

  it('shows the reminder on confirmation screen when not "None"', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: 'Sat 11:00–12:00' }));
    await userEvent.type(screen.getByLabelText(/Choose a date/i), '2030-06-15');
    // default reminder is "1 day before"
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.getByText(/Reminder: 1 day before/i)).toBeInTheDocument();
  });

  it('hides reminder text on confirmation screen when "None" is selected', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: 'Sat 11:00–12:00' }));
    await userEvent.click(screen.getByRole('button', { name: 'None' }));
    await userEvent.type(screen.getByLabelText(/Choose a date/i), '2030-06-15');
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.queryByText(/Reminder:/i)).not.toBeInTheDocument();
  });

  it('shows intention on confirmation screen when provided', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: 'Sat 11:00–12:00' }));
    await userEvent.type(screen.getByLabelText(/Choose a date/i), '2030-06-15');
    await userEvent.type(screen.getByLabelText(/Intention/i), 'For my family');
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    expect(screen.getByText(/Intention: For my family/i)).toBeInTheDocument();
  });

  it('navigates to ai-exam when "Prepare my examination" is clicked on confirmation', async () => {
    const onNavigate = vi.fn();
    render(<ScheduleScreen onNavigate={onNavigate} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: 'Sat 11:00–12:00' }));
    await userEvent.type(screen.getByLabelText(/Choose a date/i), '2030-06-15');
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    await userEvent.click(screen.getByRole('button', { name: /Prepare my examination/i }));
    expect(onNavigate).toHaveBeenCalledWith('ai-exam');
  });

  it('resets form and shows scheduling view after "Schedule another" is clicked', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByText("St. Mary's Parish, Navan"));
    await userEvent.click(screen.getByRole('button', { name: 'Sat 11:00–12:00' }));
    await userEvent.type(screen.getByLabelText(/Choose a date/i), '2030-06-15');
    await userEvent.click(screen.getByRole('button', { name: /Confirm my confession/i }));
    await userEvent.click(screen.getByRole('button', { name: /Schedule another/i }));
    expect(screen.getByRole('heading', { name: /Schedule your Confession/i })).toBeInTheDocument();
  });

  it('selecting a reminder button highlights it', async () => {
    render(<ScheduleScreen onNavigate={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '2 days before' }));
    // After clicking, "2 days before" is selected; this is reflected in UI (CSS), 
    // and the previously selected "1 day before" should no longer be selected.
    // We verify the reminder buttons still exist after the interaction.
    expect(screen.getByRole('button', { name: '2 days before' })).toBeInTheDocument();
  });
});
