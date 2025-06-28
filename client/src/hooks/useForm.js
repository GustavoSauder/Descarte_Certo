import { useState, useCallback } from 'react';

export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para atualizar valores
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Função para marcar campo como tocado
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar campo quando perde foco
    if (validationSchema) {
      try {
        validationSchema.validateSyncAt(name, values);
        setErrors(prev => ({ ...prev, [name]: '' }));
      } catch (error) {
        setErrors(prev => ({ ...prev, [name]: error.message }));
      }
    }
  }, [validationSchema, values]);

  // Função para resetar formulário
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Função para validar todo o formulário
  const validateForm = useCallback(() => {
    if (!validationSchema) return true;
    
    try {
      validationSchema.validateSync(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach(error => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  }, [validationSchema, values]);

  // Função para submeter formulário
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      // Validar formulário
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }
      
      // Executar função de submit
      await onSubmit(values);
      
      // Resetar formulário em caso de sucesso
      resetForm();
    } catch (error) {
      console.error('Erro no formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, resetForm]);

  // Função para definir valores manualmente
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Função para definir erro manualmente
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Função para verificar se formulário é válido
  const isValid = Object.keys(errors).length === 0;

  // Função para verificar se formulário foi modificado
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
  };
}; 