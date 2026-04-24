import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscriptionForm from '../../components/SubscriptionForm';

// Mock category service
vi.mock('../../services/categories', () => ({
  categoryService: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}));

// Mock subscription service
vi.mock('../../services/subscriptions', () => ({
  subscriptionService: {
    create: vi.fn().mockResolvedValue({}),
    update: vi.fn().mockResolvedValue({}),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SubscriptionForm', () => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<SubscriptionForm {...defaultProps} />);

    // Name field
    expect(screen.getByText('Subscription Name *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Netflix, Spotify, etc.')).toBeInTheDocument();

    // Amount field
    expect(screen.getByText('Amount *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('9.99')).toBeInTheDocument();

    // Currency field
    expect(screen.getByText('Currency *')).toBeInTheDocument();

    // Billing cycle field
    expect(screen.getByText('Billing Cycle *')).toBeInTheDocument();

    // Date fields
    expect(screen.getByText('Next Billing Date *')).toBeInTheDocument();
    expect(screen.getByText('First Billing Date')).toBeInTheDocument();
  });

  it('renders trial toggle checkbox', () => {
    render(<SubscriptionForm {...defaultProps} />);

    expect(screen.getByText('This is a free trial')).toBeInTheDocument();
    const trialCheckbox = screen.getByRole('checkbox', { name: /free trial/i });
    expect(trialCheckbox).toBeInTheDocument();
    expect(trialCheckbox).not.toBeChecked();
  });

  it('renders sharing toggle checkbox', () => {
    render(<SubscriptionForm {...defaultProps} />);

    expect(screen.getByText('Shared subscription')).toBeInTheDocument();
    const sharingCheckbox = screen.getByRole('checkbox', { name: /shared subscription/i });
    expect(sharingCheckbox).toBeInTheDocument();
    expect(sharingCheckbox).not.toBeChecked();
  });

  it('renders usage rating stars', () => {
    render(<SubscriptionForm {...defaultProps} />);

    expect(screen.getByText('How often do you use this?')).toBeInTheDocument();
    // 5 star buttons
    const starButtons = screen.getAllByText('★');
    expect(starButtons).toHaveLength(5);
  });

  it('shows trial date picker when trial is checked', async () => {
    const { rerender } = render(<SubscriptionForm {...defaultProps} />);

    // Trial date picker should NOT be visible initially
    expect(screen.queryByText('Trial ends on')).not.toBeInTheDocument();

    // Simulate checking the trial checkbox by rendering with subscription that has isTrial
    rerender(
      <SubscriptionForm
        {...defaultProps}
        subscription={{ isTrial: true, trialEndsAt: '2025-12-31T00:00:00Z' }}
      />
    );

    expect(screen.getByText('Trial ends on')).toBeInTheDocument();
  });

  it('shows member count when sharing is checked', () => {
    // Render with a subscription that has isShared = true
    render(
      <SubscriptionForm
        {...defaultProps}
        subscription={{ isShared: true, totalMembers: 3 }}
      />
    );

    expect(screen.getByText('Number of people sharing')).toBeInTheDocument();
  });

  it('submit button exists and is enabled', () => {
    render(<SubscriptionForm {...defaultProps} />);

    const submitButton = screen.getByRole('button', { name: /create subscription/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('shows update button when editing existing subscription', () => {
    render(
      <SubscriptionForm
        {...defaultProps}
        subscription={{ id: '1', name: 'Netflix', amount: 15.99 }}
      />
    );

    const updateButton = screen.getByRole('button', { name: /update subscription/i });
    expect(updateButton).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<SubscriptionForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });
});
