import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Button from './Button';

const FileUpload = ({
  onFileSelect,
  multiple = false,
  accept = '*',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  className = '',
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Validar arquivo
  const validateFile = (file) => {
    const errors = [];

    // Verificar tipo
    if (accept !== '*' && !accept.split(',').some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(new RegExp(type.replace('*', '.*')));
    })) {
      errors.push(`Tipo de arquivo não suportado: ${file.name}`);
    }

    // Verificar tamanho
    if (file.size > maxSize) {
      errors.push(`Arquivo muito grande: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    }

    return errors;
  };

  // Processar arquivos selecionados
  const processFiles = useCallback((fileList) => {
    const newFiles = Array.from(fileList);
    const newErrors = [];

    // Verificar limite de arquivos
    if (!multiple && newFiles.length > 1) {
      newErrors.push('Apenas um arquivo é permitido');
      return;
    }

    if (files.length + newFiles.length > maxFiles) {
      newErrors.push(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Validar cada arquivo
    newFiles.forEach(file => {
      const fileErrors = validateFile(file);
      newErrors.push(...fileErrors);
    });

    if (newErrors.length === 0) {
      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      setFiles(updatedFiles);
      onFileSelect(multiple ? updatedFiles : newFiles[0]);
    } else {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }
  }, [files, multiple, maxFiles, maxSize, accept, onFileSelect]);

  // Handlers de drag & drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    processFiles(droppedFiles);
  }, [disabled, processFiles]);

  // Handler de clique no input
  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  // Remover arquivo
  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileSelect(multiple ? updatedFiles : null);
  };

  // Preview de imagem
  const ImagePreview = ({ file, index }) => {
    const [preview, setPreview] = useState(null);

    React.useEffect(() => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      }
    }, [file]);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="relative group"
      >
        <div className="w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <PhotoIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <button
          onClick={() => removeFile(index)}
          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate max-w-20">
          {file.name}
        </p>
      </motion.div>
    );
  };

  return (
    <div className={className}>
      {/* Área de upload */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {isDragOver ? 'Solte os arquivos aqui' : 'Clique para selecionar ou arraste arquivos'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {accept !== '*' ? `Tipos aceitos: ${accept}` : 'Todos os tipos de arquivo'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Tamanho máximo: {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        </div>
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Erros */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview dos arquivos */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Arquivos selecionados ({files.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {files.map((file, index) => (
                <ImagePreview key={index} file={file} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Botão de limpar */}
      {files.length > 0 && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles([]);
              onFileSelect(multiple ? [] : null);
            }}
          >
            Limpar arquivos
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 