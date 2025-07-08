import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Generic Charts component
const Charts = ({ type = 'line', data, options = {}, ...props }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: options.title || 'Chart',
      },
    },
    ...options,
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={defaultOptions} {...props} />;
      case 'bar':
        return <Bar data={data} options={defaultOptions} {...props} />;
      case 'doughnut':
        return <Doughnut data={data} options={defaultOptions} {...props} />;
      default:
        return <Line data={data} options={defaultOptions} {...props} />;
    }
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
};

// Gráfico de barras
export const BarChart = ({
  data = [],
  width = 400,
  height = 300,
  margin = { top: 20, right: 20, bottom: 40, left: 40 },
  colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
  className = '',
  title,
}) => {
  if (!data.length) return null;

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = chartWidth / data.length;
  const barSpacing = barWidth * 0.1;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <Line options={options} data={data} />
    </div>
  );
};

// Gráfico de pizza
export const PieChart = ({
  data = [],
  width = 300,
  height = 300,
  colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
  className = '',
  title,
}) => {
  if (!data.length) return null;

  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2; // Começar do topo

  const createArc = (startAngle, endAngle) => {
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <Doughnut options={options} data={data} />
    </div>
  );
};

// Gráfico de linha
export const LineChart = ({
  data = [],
  width = 400,
  height = 300,
  margin = { top: 20, right: 20, bottom: 40, left: 40 },
  color = '#10B981',
  className = '',
  title,
}) => {
  if (!data.length) return null;

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const valueRange = maxValue - minValue;
  
  const xStep = chartWidth / (data.length - 1);
  
  const points = data.map((item, index) => {
    const x = margin.left + index * xStep;
    const y = margin.top + chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <Line options={options} data={data} />
    </div>
  );
};

// Card de estatísticas
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon,
  className = '',
}) => {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const changeIcons = {
    positive: '↗',
    negative: '↘',
    neutral: '→',
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeColors[changeType]}`}>
              {changeIcons[changeType]} {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const DoughnutChart = ({ data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Doughnut options={options} data={data} />;
};

// Componente específico para estatísticas de descarte por material
export const DisposalByMaterialChart = ({ data }) => {
  const chartData = {
    labels: ['Plástico', 'Vidro', 'Papel', 'Metal', 'Orgânico', 'Eletrônico'],
    datasets: [
      {
        label: 'Quantidade (kg)',
        data: [
          data.plastic || 0,
          data.glass || 0,
          data.paper || 0,
          data.metal || 0,
          data.organic || 0,
          data.electronic || 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <DoughnutChart data={chartData} title="Descarte por Material" />;
};

// Componente para evolução de usuários ao longo do tempo
export const UsersEvolutionChart = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Usuários Ativos',
        data: data.users || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: 'Novos Usuários',
        data: data.newUsers || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return <LineChart data={chartData} title="Evolução de Usuários" />;
};

// Componente para ranking de escolas
export const SchoolRankingChart = ({ data }) => {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Pontos por Escola',
        data: data.points || [],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <BarChart data={chartData} title="Ranking de Escolas" />;
};

export default Charts;

// End of file 