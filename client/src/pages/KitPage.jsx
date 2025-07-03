import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaQrcode, FaSchool, FaRecycle, FaCube, FaHandshake, FaTimes, FaUser, FaEnvelope, FaPhone, FaBuilding, FaFileAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { useSchoolMetrics } from '../hooks';

export default function KitPage() {
  const { participatingSchools, totalRecycledWaste, products3D, loading, error } = useSchoolMetrics();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: '',
    institutionType: 'school',
    cpfCnpj: '',
    responsibleName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    message: '',
    partnershipType: 'educational'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const qrCodeData = {
    url: 'https://descarte-certo.com/app',
    title: 'Descarte Certo App',
    description: 'Escaneie para baixar o aplicativo'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartnershipSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Simular envio para o backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aqui seria a chamada real para a API
      // const response = await fetch('/api/partnerships', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setSubmitStatus('success');
      setTimeout(() => {
        setShowPartnershipForm(false);
        setSubmitStatus(null);
        setFormData({
          institutionName: '',
          institutionType: 'school',
          cpfCnpj: '',
          responsibleName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          message: '',
          partnershipType: 'educational'
        });
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const validateForm = () => {
    return formData.institutionName && 
           formData.cpfCnpj && 
           formData.responsibleName && 
           formData.email && 
           formData.phone &&
           formData.city &&
           formData.state;
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Kit Educacional de Sustentabilidade
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Material completo para escolas e instituições replicarem o projeto e engajarem alunos na reciclagem sustentável.
        </p>
      </motion.div>
      
      {/* Downloads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 justify-center items-center"
      >
        <a href="/docs/cartilha-educativa.pdf" className="btn-primary w-full md:w-auto" download>
          <FaDownload className="inline mr-2" /> Baixar Cartilha Digital
        </a>
        <a href="/docs/manual-replicacao.pdf" className="btn-primary bg-blue-600 hover:bg-blue-700 w-full md:w-auto" download>
          <FaDownload className="inline mr-2" /> Manual de Replicação
        </a>
        <button 
          onClick={() => setShowQRCode(true)}
          className="btn-primary bg-gray-800 hover:bg-gray-900 w-full md:w-auto"
        >
          <FaQrcode className="inline mr-2" /> QR Code para App
        </button>
      </motion.div>

      {/* Seção de Parcerias Escolares */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-8 shadow-lg border border-green-200 dark:border-green-700"
      >
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-6 text-center">
          <FaEnvelope className="inline mr-3" />
          Parcerias Escolares e Institucionais
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">
              Como Participar
              </h3>
              <ul className="space-y-3 text-green-600 dark:text-green-400">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Cadastre sua instituição no sistema</span>
              </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Receba o kit educacional completo</span>
              </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Implemente o projeto com seus alunos</span>
              </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Acompanhe o impacto em tempo real</span>
              </li>
            </ul>
            </div>
            
            <button 
              onClick={() => setShowPartnershipForm(true)}
              className="btn-primary bg-green-600 hover:bg-green-700 w-full text-lg py-3"
            >
              <FaEnvelope className="inline mr-2" />
              Solicitar Parceria
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">
                Benefícios da Parceria
              </h3>
              <ul className="space-y-3 text-green-600 dark:text-green-400">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Material didático gratuito e atualizado</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Suporte técnico especializado</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Certificado de participação oficial</span>
              </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Dashboard exclusivo da instituição</span>
              </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Participação em eventos e premiações</span>
              </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Rede de parceiros e colaboração</span>
              </li>
            </ul>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Métricas em Tempo Real */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-8 shadow-lg border border-blue-200 dark:border-blue-700"
      >
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6 text-center">
          Impacto em Tempo Real
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-12 h-12 bg-blue-300 dark:bg-blue-600 rounded-full mb-3"></div>
                <div className="w-16 h-6 bg-blue-300 dark:bg-blue-600 rounded mb-2"></div>
                <div className="w-20 h-4 bg-blue-300 dark:bg-blue-600 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400 text-center">
            <p>Erro ao carregar métricas</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {/* Escolas Participantes */}
            <div className="flex flex-col items-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 dark:group-hover:bg-blue-500 transition-colors">
                <FaEnvelope className="text-2xl text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {participatingSchools?.toLocaleString('pt-BR') || '0'}
              </span>
              <span className="text-sm text-center text-blue-700 dark:text-blue-300">
                Escolas Participantes
              </span>
            </div>

            {/* Resíduos Reciclados */}
            <div className="flex flex-col items-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 dark:group-hover:bg-green-500 transition-colors">
                <FaRecycle className="text-2xl text-white" />
              </div>
              <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                {totalRecycledWaste?.toLocaleString('pt-BR') || '0'} kg
              </span>
              <span className="text-sm text-center text-green-700 dark:text-green-300">
                Resíduos Reciclados
              </span>
            </div>

            {/* Produtos 3D */}
            <div className="flex flex-col items-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-500 dark:bg-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-600 dark:group-hover:bg-purple-500 transition-colors">
                <FaCube className="text-2xl text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                {products3D?.toLocaleString('pt-BR') || '0'}
              </span>
              <span className="text-sm text-center text-purple-700 dark:text-purple-300">
                Produtos 3D Criados
              </span>
            </div>
          </div>
        )}
        
        {/* Indicador de atualização em tempo real */}
        <div className="mt-6 text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Atualizando em tempo real</span>
        </div>
      </motion.div>

      {/* Recursos Adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            <FaFileAlt className="inline mr-2 text-blue-600" />
            Recursos Educacionais
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Planos de aula estruturados</li>
            <li>• Atividades práticas e experimentos</li>
            <li>• Vídeos educativos e tutoriais</li>
            <li>• Avaliações e questionários</li>
            <li>• Certificados de participação</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            <FaEnvelope className="inline mr-2 text-green-600" />
            Suporte e Acompanhamento
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Mentoria especializada</li>
            <li>• Comunidade de educadores</li>
            <li>• Eventos e workshops</li>
            <li>• Relatórios de progresso</li>
            <li>• Reconhecimento e premiações</li>
          </ul>
        </Card>
      </motion.div>

      {/* Modal QR Code */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full text-center">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                QR Code do App
              </h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <img src="/qr/qr-android.png" alt="QR Code Android" className="w-48 h-48 mx-auto mb-2" />
              <p className="text-sm text-gray-500">QR Code para baixar o app Android</p>
              <div className="flex flex-col gap-2 mt-4">
                <a href="/apps/descarte-certo-android.apk" className="btn-primary bg-green-600 hover:bg-green-700 w-full" download>
                  Baixar para Android
                </a>
                <a href="/apps/descarte-certo-ios.ipa" className="btn-primary bg-gray-800 hover:bg-gray-900 w-full" download>
                  Baixar para iOS
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Escaneie o QR Code ou clique nos links para baixar o aplicativo Descarte Certo
            </p>
          </div>
        </div>
      )}

      {/* Modal Formulário de Parceria */}
      {showPartnershipForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                <FaEnvelope className="inline mr-2 text-green-600" />
                Solicitar Parceria
              </h3>
              <button
                onClick={() => setShowPartnershipForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                  Solicitação Enviada!
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Sua solicitação de parceria foi enviada com sucesso. Entraremos em contato em breve.
                </p>
              </div>
            ) : submitStatus === 'error' ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                  Erro ao Enviar
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  Houve um erro ao enviar sua solicitação. Tente novamente.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnershipSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome da Instituição */}
                  <div>
                    <label htmlFor="kit-institution-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaBuilding className="inline mr-1" />
                      Nome da Instituição *
                    </label>
                    <input
                      type="text"
                      id="kit-institution-name"
                      name="institutionName"
                      value={formData.institutionName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Tipo de Instituição */}
                  <div>
                    <label htmlFor="kit-institution-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Instituição *
                    </label>
                    <select
                      id="kit-institution-type"
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="school">Escola</option>
                      <option value="university">Universidade</option>
                      <option value="company">Empresa</option>
                      <option value="ngo">ONG</option>
                      <option value="government">Órgão Público</option>
                    </select>
                  </div>

                  {/* CPF/CNPJ */}
                  <div>
                    <label htmlFor="kit-cpf-cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CPF/CNPJ *
                    </label>
                    <input
                      type="text"
                      id="kit-cpf-cnpj"
                      name="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      required
                    />
                  </div>

                  {/* Nome do Responsável */}
                  <div>
                    <label htmlFor="kit-responsible-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaUser className="inline mr-1" />
                      Nome do Responsável *
                    </label>
                    <input
                      type="text"
                      id="kit-responsible-name"
                      name="responsibleName"
                      value={formData.responsibleName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="kit-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaEnvelope className="inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      id="kit-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label htmlFor="kit-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaPhone className="inline mr-1" />
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="kit-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>

                  {/* Cidade */}
                  <div>
                    <label htmlFor="kit-city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      id="kit-city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  {/* Estado */}
                  <div>
                    <label htmlFor="kit-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado *
                    </label>
                    <select
                      id="kit-state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      required
                    >
                      <option value="">Selecione um estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>

                  {/* Tipo de Parceria */}
                  <div>
                    <label htmlFor="kit-partnership-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Parceria *
                    </label>
                    <select
                      id="kit-partnership-type"
                      name="partnershipType"
                      value={formData.partnershipType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="educational">Educacional</option>
                      <option value="research">Pesquisa</option>
                      <option value="commercial">Comercial</option>
                      <option value="social">Social</option>
                      <option value="government">Governamental</option>
                    </select>
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="kit-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensagem Adicional
                  </label>
                  <textarea
                    id="kit-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Conte-nos mais sobre sua instituição e como gostaria de participar do projeto..."
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPartnershipForm(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
            <button
                    type="submit"
                    disabled={!validateForm() || submitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loading text="Enviando..." />
                      </>
                    ) : (
                      'Enviar Solicitação'
                    )}
            </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 