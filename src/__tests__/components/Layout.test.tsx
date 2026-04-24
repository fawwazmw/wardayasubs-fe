import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Layout from '../../components/Layout';

// Mock react-router-dom
const mockNavigate = vi.fn();
const mockLocation = { pathname: '/dashboard', hash: '#overview' };
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

// Mock useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@wardaya.com',
      name: 'Test User',
      isAdmin: false,
    },
    logout: vi.fn(),
  }),
}));

// Mock useTheme
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: vi.fn(),
  }),
}));

// Mock NotificationBell
vi.mock('../../components/NotificationBell', () => ({
  default: () => <div data-testid="notification-bell">Bell</div>,
}));

// Mock KeyboardShortcutsHelp
vi.mock('../../components/KeyboardShortcutsHelp', () => ({
  default: () => <div data-testid="keyboard-shortcuts-help" />,
}));

// Mock useGlobalShortcuts
vi.mock('../../hooks/useKeyboardShortcuts', () => ({
  useGlobalShortcuts: vi.fn(),
}));

describe('Layout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar with navigation items', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('renders user name and email in sidebar', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@wardaya.com')).toBeInTheDocument();
  });

  it('renders notification bell', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    // NotificationBell is rendered twice (sidebar + mobile header)
    const bells = screen.getAllByTestId('notification-bell');
    expect(bells.length).toBeGreaterThanOrEqual(1);
  });

  it('shows mobile menu button', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    // The mobile header has a Menu button (the hamburger icon)
    // It's inside the lg:hidden header
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    // The header contains a button for the menu
    const buttons = header?.querySelectorAll('button');
    expect(buttons?.length).toBeGreaterThanOrEqual(1);
  });

  it('renders children content', () => {
    render(
      <Layout>
        <div>Page Content</div>
      </Layout>
    );

    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
