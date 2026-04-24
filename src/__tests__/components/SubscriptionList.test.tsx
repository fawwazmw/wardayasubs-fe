import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubscriptionList from '../../components/SubscriptionList';

// Mock subscription service
const mockGetAll = vi.fn();
vi.mock('../../services/subscriptions', () => ({
  subscriptionService: {
    getAll: (...args: any[]) => mockGetAll(...args),
    delete: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue({}),
    bulkDelete: vi.fn().mockResolvedValue({ message: 'Deleted', count: 1 }),
  },
}));

// Mock category service
vi.mock('../../services/categories', () => ({
  categoryService: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock lucide-react icons to simple spans
vi.mock('lucide-react', () => ({
  Calendar: (props: any) => <span data-testid="icon-calendar" {...props} />,
  DollarSign: (props: any) => <span data-testid="icon-dollar" {...props} />,
  Edit2: (props: any) => <span data-testid="icon-edit" {...props} />,
  Trash2: (props: any) => <span data-testid="icon-trash" {...props} />,
  Tag: (props: any) => <span data-testid="icon-tag" {...props} />,
  Search: (props: any) => <span data-testid="icon-search" {...props} />,
  Filter: (props: any) => <span data-testid="icon-filter" {...props} />,
  CheckSquare: (props: any) => <span data-testid="icon-check-square" {...props} />,
  Square: (props: any) => <span data-testid="icon-square" {...props} />,
  Users: (props: any) => <span data-testid="icon-users" {...props} />,
  Clock: (props: any) => <span data-testid="icon-clock" {...props} />,
}));

const mockSubscriptions = [
  {
    id: '1',
    name: 'Netflix',
    amount: 15.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '2025-06-01T00:00:00Z',
    isActive: true,
    isTrial: false,
    isShared: false,
  },
  {
    id: '2',
    name: 'Spotify',
    amount: 9.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '2025-06-15T00:00:00Z',
    isActive: true,
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    isShared: false,
  },
  {
    id: '3',
    name: 'Disney+',
    amount: 12.99,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '2025-07-01T00:00:00Z',
    isActive: true,
    isTrial: false,
    isShared: true,
    totalMembers: 4,
    userShare: 3.25,
  },
  {
    id: '4',
    name: 'GitHub Pro',
    amount: 4.0,
    currency: 'USD',
    billingCycle: 'monthly',
    nextBillingDate: '2025-06-20T00:00:00Z',
    isActive: true,
    isTrial: false,
    isShared: false,
    usageRating: 5,
  },
];

describe('SubscriptionList', () => {
  const defaultProps = {
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    // Make getAll never resolve so we stay in loading state
    mockGetAll.mockReturnValue(new Promise(() => {}));

    render(<SubscriptionList {...defaultProps} />);

    expect(screen.getByText('Loading subscriptions...')).toBeInTheDocument();
  });

  it('shows "No subscriptions yet" when empty', async () => {
    mockGetAll.mockResolvedValue([]);

    render(<SubscriptionList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('No subscriptions yet')).toBeInTheDocument();
    });
  });

  it('renders subscription cards with name and amount', async () => {
    mockGetAll.mockResolvedValue(mockSubscriptions);

    render(<SubscriptionList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Netflix')).toBeInTheDocument();
    });

    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.getByText('Disney+')).toBeInTheDocument();
    expect(screen.getByText('GitHub Pro')).toBeInTheDocument();

    // Check amounts are rendered (formatted as currency)
    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('$4.00')).toBeInTheDocument();
  });

  it('shows trial badge for trial subscriptions', async () => {
    mockGetAll.mockResolvedValue(mockSubscriptions);

    render(<SubscriptionList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Spotify')).toBeInTheDocument();
    });

    // Trial badge should show "Trial: X days left"
    const trialBadge = screen.getByText(/Trial:.*day/);
    expect(trialBadge).toBeInTheDocument();
  });

  it('shows sharing badge for shared subscriptions', async () => {
    mockGetAll.mockResolvedValue(mockSubscriptions);

    render(<SubscriptionList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Disney+')).toBeInTheDocument();
    });

    // Sharing badge should show "Shared · 4 people"
    const sharingBadge = screen.getByText(/Shared.*4 people/);
    expect(sharingBadge).toBeInTheDocument();
  });

  it('shows star rating when usageRating is set', async () => {
    mockGetAll.mockResolvedValue(mockSubscriptions);

    render(<SubscriptionList {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('GitHub Pro')).toBeInTheDocument();
    });

    // Usage rating of 5 should show "★★★★★"
    const ratingBadge = screen.getByText('★★★★★');
    expect(ratingBadge).toBeInTheDocument();
  });
});
