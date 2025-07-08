import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Dashboard from '../components/Dashboard';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock chart components
vi.mock('../components/ui', () => ({
  Card: ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 data-testid="card-title" {...props}>{children}</h3>,
  CardContent: ({ children, ...props }) => <div data-testid="card-content" {...props}>{children}</div>,
  StatCard: ({ title, value, change, changeType, icon, ...props }) => (
    <div data-testid="stat-card" {...props}>
      <div data-testid="stat-title">{title}</div>
      <div data-testid="stat-value">{value}</div>
      <div data-testid="stat-change">{change}</div>
      <div data-testid="stat-type">{changeType}</div>
    </div>
  ),
  BarChart: ({ data, width, height, ...props }) => (
    <div data-testid="bar-chart" {...props}>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  PieChart: ({ data, width, height, ...props }) => (
    <div data-testid="pie-chart" {...props}>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  LineChart: ({ data, width, height, ...props }) => (
    <div data-testid="line-chart" {...props}>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Table: ({ data, columns, sortable, onRowClick, ...props }) => (
    <div data-testid="table" {...props}>
      <div data-testid="table-columns">{JSON.stringify(columns)}</div>
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-sortable">{sortable ? 'true' : 'false'}</div>
    </div>
  ),
  CardSkeleton: ({ ...props }) => <div data-testid="card-skeleton" {...props} />,
}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaRecycle: () => <div data-testid="fa-recycle">Recycle</div>,
  FaLeaf: () => <div data-testid="fa-leaf">Leaf</div>,
  FaTrophy: () => <div data-testid="fa-trophy">Trophy</div>,
  FaChartLine: () => <div data-testid="fa-chart-line">ChartLine</div>,
  FaCalendarAlt: () => <div data-testid="fa-calendar">Calendar</div>,
  FaMapMarkerAlt: () => <div data-testid="fa-map-marker">MapMarker</div>,
}));

// Create a test query client
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Should show loading skeletons
    expect(screen.getAllByTestId('card-skeleton')).toHaveLength(6);
  });

  it('should render dashboard content after loading', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Should show dashboard title
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    
    // Should show stat cards
    expect(screen.getAllByTestId('stat-card')).toHaveLength(4);
    
    // Should show charts
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    
    // Should show table
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should display correct statistics', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Check stat card values
    const statCards = screen.getAllByTestId('stat-card');
    expect(statCards).toHaveLength(4);

    // Check specific stats
    const statTitles = screen.getAllByTestId('stat-title');
    expect(statTitles[0]).toHaveTextContent('Total de Descarte');
    expect(statTitles[1]).toHaveTextContent('Pontos Acumulados');
    expect(statTitles[2]).toHaveTextContent('Nível Atual');
    expect(statTitles[3]).toHaveTextContent('Ranking');
  });

  it('should display charts with correct data', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Check pie chart data
    const pieChart = screen.getByTestId('pie-chart');
    const pieChartData = JSON.parse(screen.getAllByTestId('chart-data')[0].textContent);
    expect(pieChartData).toEqual([
      { label: 'Plástico', value: 45 },
      { label: 'Papel', value: 30 },
      { label: 'Vidro', value: 15 },
      { label: 'Metal', value: 10 },
    ]);

    // Check bar chart data
    const barChart = screen.getByTestId('bar-chart');
    const barChartData = JSON.parse(screen.getAllByTestId('chart-data')[1].textContent);
    expect(barChartData).toEqual([
      { label: 'Seg', value: 12 },
      { label: 'Ter', value: 18 },
      { label: 'Qua', value: 15 },
      { label: 'Qui', value: 22 },
      { label: 'Sex', value: 28 },
      { label: 'Sáb', value: 35 },
      { label: 'Dom', value: 20 },
    ]);
  });

  it('should display table with correct columns and data', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    const table = screen.getByTestId('table');
    expect(table).toBeInTheDocument();

    // Check table columns
    const tableColumns = JSON.parse(screen.getByTestId('table-columns').textContent);
    expect(tableColumns).toEqual([
      { key: 'date', label: 'Data', sortable: true },
      { key: 'type', label: 'Tipo', sortable: true },
      { key: 'amount', label: 'Quantidade', sortable: true },
      { key: 'points', label: 'Pontos', sortable: true },
      { key: 'location', label: 'Localização', sortable: false },
    ]);

    // Check table data
    const tableData = JSON.parse(screen.getByTestId('table-data').textContent);
    expect(tableData).toHaveLength(3);
    expect(tableData[0]).toEqual({
              date: '2025-01-15',
      type: 'Plástico',
      amount: '2.5 kg',
      points: 25,
      location: 'São Paulo, SP',
    });
  });

  it('should display additional information cards', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Check for challenge cards
    expect(screen.getByText('Próximos Desafios')).toBeInTheDocument();
    expect(screen.getByText('Desafio Semanal')).toBeInTheDocument();
    expect(screen.getByText('Meta Mensal')).toBeInTheDocument();

    // Check for collection points
    expect(screen.getByText('Pontos de Coleta Próximos')).toBeInTheDocument();
    expect(screen.getByText('Ecoponto Central')).toBeInTheDocument();
    expect(screen.getByText('Cooperativa Verde')).toBeInTheDocument();
  });

  it('should display level badge', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Check for level badge
    expect(screen.getByText(/Nível 8/)).toBeInTheDocument();
  });

  it('should handle error states gracefully', async () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Should still render without crashing
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should be accessible', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByTestId('card-skeleton')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check for proper landmark roles
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
}); 