import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RefreshButton } from './RefreshButton';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

describe('RefreshButton', () => {
  it('renders with the correct label', () => {
    render(<RefreshButton />);
    expect(screen.getByRole('button', { name: /Gerar novo código/i })).toBeInTheDocument();
  });

  it('is not disabled on initial render', () => {
    render(<RefreshButton />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
});
