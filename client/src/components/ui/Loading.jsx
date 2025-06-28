import React from 'react';
import { motion } from 'framer-motion';

// Loading spinner simples
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizes[size]} border-2 border-gray-300 border-t-green-600 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

// Loading com texto
export const Loading = ({ text = 'Carregando...', size = 'md', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Spinner size={size} />
      {text && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
};

// Skeleton para cards
export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton para listas
export const ListSkeleton = ({ items = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton para tabelas
export const TableSkeleton = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading overlay para páginas inteiras
export const LoadingOverlay = ({ children, loading, text = 'Carregando...' }) => {
  if (!loading) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
        <Loading text={text} size="lg" />
      </div>
    </div>
  );
};

export default Loading; 