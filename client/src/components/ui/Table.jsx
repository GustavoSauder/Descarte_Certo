import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { TableSkeleton } from './Loading';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  sortable = true,
  selectable = false,
  onRowClick,
  className = '',
  emptyMessage = 'Nenhum dado encontrado',
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Ordenação
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Função de ordenação
  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Função de seleção
  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((_, index) => index)));
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  // Ícone de ordenação
  const SortIcon = ({ columnKey }) => {
    if (!sortable) return null;
    
    if (sortConfig.key !== columnKey) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 text-green-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-green-600" />
    );
  };

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    <SortIcon columnKey={column.key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={selectable ? columns.length + 1 : columns.length}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedRows.has(index) ? 'bg-green-50 dark:bg-green-900/20' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={() => handleSelectRow(index)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {column.render ? column.render(row[column.key], row, index) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente de paginação
export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 ${className}`}>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

// Hook para gerenciar paginação
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return {
    currentPage,
    paginatedData,
    totalPages,
    goToPage,
    itemsPerPage,
  };
};

export default Table; 