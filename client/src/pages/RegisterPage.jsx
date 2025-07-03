import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaGoogle, FaSpinner, FaCheck } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase.js';
import PasswordInput from '../components/ui/PasswordInput';
import * as Yup from 'yup';
import { register } from '../services/userService';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-zÀ-ÿ' ]+$/, 'Nome deve conter apenas letras')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  password: Yup.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
    .matches(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial')
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
  school: Yup.string(),
  grade: Yup.string()
});

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    grade: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 5);
  };

  const getPasswordStrengthText = () => {
    const texts = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];
    return {
      text: texts[passwordStrength - 1] || '',
      color: colors[passwordStrength - 1] || 'text-gray-400'
    };
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Tentando cadastrar...', formData);
    if (!(await validateForm())) return;
    setIsLoading(true);
    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        school: formData.school.trim() || undefined,
        grade: formData.grade.trim() || undefined
      };
      const { data } = await register(userData);
      if (data && data.message) {
        setErrors({});
        setSuccessMsg('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      } else {
        setErrors({ general: 'Erro ao criar conta. Tente novamente.' });
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setErrors({ general: error?.response?.data?.error || error.message || 'Erro ao criar conta.' });
    } finally {
      setIsLoading(false);
      console.log('Cadastro finalizado.');
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        setErrors({ general: error.message });
      }
    } catch (error) {
      setErrors({ general: 'Erro ao fazer cadastro com Google' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Card de Cadastro */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <FaLeaf className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Crie sua conta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Junte-se ao Descarte Certo e faça a diferença
            </p>
          </div>

          {/* Formulário */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Campo Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  ${errors.name 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                `}
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                  ${errors.email 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  }
                `}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha *
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Sua senha"
                error={errors.password}
                disabled={isLoading}
              />
              
              {/* Indicador de força da senha */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength
                            ? getPasswordStrengthText().color.replace('text-', 'bg-')
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${getPasswordStrengthText().color}`}>
                    {getPasswordStrengthText().text}
                  </p>
                </div>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Senha *
              </label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                error={errors.confirmPassword}
                disabled={isLoading}
              />
            </div>

            {/* Campo Escola */}
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Escola (opcional)
              </label>
              <input
                type="text"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nome da sua escola"
                disabled={isLoading}
              />
            </div>

            {/* Campo Série */}
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Série (opcional)
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="">Selecione sua série</option>
                <option value="1º ano">1º ano</option>
                <option value="2º ano">2º ano</option>
                <option value="3º ano">3º ano</option>
                <option value="4º ano">4º ano</option>
                <option value="5º ano">5º ano</option>
                <option value="6º ano">6º ano</option>
                <option value="7º ano">7º ano</option>
                <option value="8º ano">8º ano</option>
                <option value="9º ano">9º ano</option>
                <option value="1º ano EM">1º ano EM</option>
                <option value="2º ano EM">2º ano EM</option>
                <option value="3º ano EM">3º ano EM</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Erro Geral */}
            {errors.general && (
              <div className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg px-4 py-2 mb-4 text-center text-sm font-medium">
                {errors.general}
              </div>
            )}

            {/* Mensagem de Sucesso */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4"
              >
                <p className="text-sm text-green-700 dark:text-green-300">{successMsg}</p>
              </motion.div>
            )}

            {/* Botão de Cadastro */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-700 hover:bg-green-800 active:bg-green-900'}
                text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center w-full">
                  <FaSpinner className="animate-spin mr-2" /> Cadastrando...
                </span>
              ) : (
                'Cadastrar'
              )}
            </motion.button>

            {/* Divisor */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Ou continue com
                </span>
              </div>
            </div>

            {/* Botão Google */}
            <motion.button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center"
            >
              <FaGoogle className="mr-2 text-red-500" />
              Google
            </motion.button>
          </motion.form>

          {/* Link para Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
              >
                Faça login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage; 