import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({
  value,
  onChange,
  placeholder = 'Senha',
  className = '',
  error,
  disabled = false,
  required = false,
  id,
  name,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        className={`
          w-full px-4 py-3 pr-12 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          ${error 
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={disabled}
        required={required}
        id={id}
        name={name}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className={`
          absolute right-3 top-1/2 transform -translate-y-1/2
          p-1 rounded-md transition-colors duration-200
          ${disabled 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          }
        `}
        disabled={disabled}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
      </button>

      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput; 