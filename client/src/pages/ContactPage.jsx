import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, 
  FaInstagram, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaClock,
  FaLeaf,
  FaCheck,
  FaSpinner
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../hooks';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  subject: Yup.string()
    .min(5, 'Assunto deve ter pelo menos 5 caracteres')
    .required('Assunto é obrigatório'),
  message: Yup.string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .required('Mensagem é obrigatória'),
  school: Yup.string(),
  phone: Yup.string()
});

const ContactPage = () => {
  const { t } = useTranslation();
  const { addNotification } = useAppState();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    school: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando usuário digita
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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
    
    if (!(await validateForm())) {
      addNotification({
        type: 'error',
        title: 'Erro de validação',
        message: 'Por favor, corrija os erros no formulário.'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          school: '',
          phone: ''
        });
        addNotification({
          type: 'success',
          title: 'Mensagem enviada!',
          message: 'Obrigado pelo contato. Responderemos em breve!'
        });
      } else {
        throw new Error('Erro ao enviar mensagem');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível enviar a mensagem. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'contato@descarte-certo.com',
      link: 'mailto:contato@descarte-certo.com',
      color: 'text-blue-600'
    },
    {
      icon: FaPhone,
      title: 'Telefone',
      value: '(11) 99999-9999',
      link: 'tel:+5511999999999',
      color: 'text-green-600'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: '(11) 99999-9999',
      link: 'https://wa.me/5511999999999',
      color: 'text-green-600'
    },
    {
      icon: FaInstagram,
      title: 'Instagram',
      value: '@descarte_certo',
      link: 'https://instagram.com/descarte_certo',
      color: 'text-pink-600'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Endereço',
      value: 'São Paulo, SP - Brasil',
      link: 'https://goo.gl/maps/xyz',
      color: 'text-red-600'
    },
    {
      icon: FaClock,
      title: 'Horário',
      value: 'Seg-Sex: 8h às 18h',
      color: 'text-purple-600'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Mensagem Enviada!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Obrigado pelo contato! Nossa equipe responderá em breve.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 hover:bg-green-700"
            >
              Enviar Nova Mensagem
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <FaLeaf className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Tem alguma dúvida, sugestão ou quer saber mais sobre o Descarte Certo? 
              Estamos aqui para ajudar!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Formulário de Contato */}
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left">
                Envie sua Mensagem
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        errors.name 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg transition-colors ${
                        errors.email 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Escola (opcional)
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-green-500 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Nome da escola"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg transition-colors ${
                      errors.subject 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Assunto da mensagem"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full p-3 border rounded-lg transition-colors resize-none ${
                      errors.message 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
                    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                    placeholder="Digite sua mensagem aqui..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </Button>
              </form>
            </Card>

            {/* Informações de Contato */}
            <div className="space-y-6">
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center lg:text-left">
                  Informações de Contato
                </h2>
                
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${info.color}`}>
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400">
                            {info.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Card de Horário */}
              <Card className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center lg:text-left">
                  Horário de Atendimento
                </h3>
                <div className="space-y-2 text-center lg:text-left">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Segunda a Sexta:</span> 8h às 18h
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Sábado:</span> 9h às 14h
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Domingo:</span> Fechado
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage; 