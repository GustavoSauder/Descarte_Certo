import React, { useState, useEffect } from 'react';
import { FaCog, FaBell, FaEye, FaDownload, FaTrash, FaShieldAlt, FaPalette, FaKeyboard, FaGlobe, FaUserSecret, FaDatabase, FaSync, FaLock, FaUnlock, FaVolumeUp, FaVolumeMute, FaMobile, FaDesktop, FaMoon, FaSun, FaCheck, FaTimes, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppState } from '../hooks';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import Modal from '../components/ui/Modal';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, themeMode, setThemeModeAndTheme, addNotification } = useAppState();
  
  const [settings, setSettings] = useState({
    // Aparência
    fontSize: 'medium',
    contrast: 'normal',
    animations: true,
    
    // Notificações
    emailNotifications: true,
    pushNotifications: true,
    achievementNotifications: true,
    rankingNotifications: true,
    weeklyReports: false,
    marketingEmails: false,
    
    // Privacidade
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
    allowAnalytics: true,
    
    // Acessibilidade
    screenReader: false,
    highContrast: false,
    reduceMotion: false,
    keyboardNavigation: true,
    
    // Dados
    autoBackup: true,
    backupFrequency: 'weekly',
    exportFormat: 'json',
    
    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginNotifications: true,
    
    // Idioma e Região
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BRL'
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Carregar configurações do localStorage
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as configurações'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Salvar no localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      // Aplicar configurações
      applySettings(settings);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addNotification({
        type: 'success',
        title: 'Sucesso',
        message: 'Configurações salvas com sucesso!'
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível salvar as configurações'
      });
    } finally {
      setLoading(false);
    }
  };

  const applySettings = (newSettings) => {
    // Aplicar tamanho da fonte
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.fontSize = fontSizeMap[newSettings.fontSize] || '16px';
    
    // Aplicar contraste
    if (newSettings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Aplicar redução de movimento
    if (newSettings.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  const handleThemeChange = (newTheme) => {
    setThemeModeAndTheme(newTheme);
    addNotification({
      type: 'success',
      title: 'Tema Alterado',
      message: `Tema alterado para ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'escuro' : 'automático'}`
    });
  };

  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    addNotification({
      type: 'success',
      title: 'Idioma Alterado',
      message: `Idioma alterado para ${newLanguage === 'pt' ? 'Português' : 'English'}`
    });
  };

  const exportData = async () => {
    try {
      setExporting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = {
        user: {
          name: 'Usuário Exemplo',
          email: 'usuario@exemplo.com',
          joinDate: '2025-01-01'
        },
        achievements: [
                      { id: 1, name: 'Primeiro Descarte', date: '2025-01-15' },
            { id: 2, name: 'Reciclador Bronze', date: '2025-02-01' }
        ],
        disposals: [
                      { id: 1, type: 'plástico', amount: 2.5, date: '2025-01-15' },
            { id: 2, type: 'papel', amount: 1.8, date: '2025-02-01' }
        ],
        settings: settings
      };
    
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `descarte-certo-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    
      setShowExportModal(false);
      addNotification({
        type: 'success',
        title: 'Exportação Concluída',
        message: 'Seus dados foram exportados com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível exportar os dados'
      });
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setDeleting(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Limpar dados locais
      localStorage.clear();
      
      setShowDeleteModal(false);
      addNotification({
        type: 'success',
        title: 'Conta Deletada',
        message: 'Sua conta foi deletada com sucesso'
      });
      
      // Redirecionar para home
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      addNotification({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível deletar a conta'
      });
    } finally {
      setDeleting(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Aparência', icon: FaPalette, color: 'purple' },
    { id: 'notifications', label: 'Notificações', icon: FaBell, color: 'blue' },
    { id: 'privacy', label: 'Privacidade', icon: FaShieldAlt, color: 'green' },
    { id: 'accessibility', label: 'Acessibilidade', icon: FaEye, color: 'orange' },
    { id: 'data', label: 'Dados', icon: FaDatabase, color: 'teal' },
    { id: 'security', label: 'Segurança', icon: FaLock, color: 'red' },
    { id: 'language', label: 'Idioma', icon: FaGlobe, color: 'indigo' }
  ];

  if (loading) return <Loading text="Carregando configurações..." />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaCog className="text-4xl text-gray-600 dark:text-gray-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Configurações
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Personalize sua experiência e gerencie suas preferências na plataforma
          </p>
        </motion.div>

        {/* Botão Salvar */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex justify-center"
          >
            <Button
              onClick={saveSettings}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <FaSave />
              Salvar Alterações
            </Button>
          </motion.div>
        )}

        {/* Tabs de Navegação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? `bg-${tab.color}-600 text-white shadow-lg`
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="text-lg" />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Conteúdo das Configurações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Aparência */}
          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaPalette className="text-purple-600" />
                  Tema e Cores
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tema
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ value: 'light', label: 'Claro', icon: FaSun }, { value: 'dark', label: 'Escuro', icon: FaMoon }, { value: 'system', label: 'Automático', icon: FaSync }].map((themeOption) => {
                        const Icon = themeOption.icon;
                        const isActive = themeMode === themeOption.value;
                        return (
                          <button
                            key={themeOption.value}
                            onClick={() => handleThemeChange(themeOption.value)}
                            className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? 'bg-green-600 text-white border-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900'}`}
                            aria-pressed={isActive}
                          >
                            <Icon className="text-lg" />
                            <span className="text-xs">{themeOption.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamanho da Fonte
                    </label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                      <option value="extra-large">Extra Grande</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.animations}
                        onChange={(e) => handleSettingChange('animations', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Habilitar animações
                      </span>
                    </label>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaEye className="text-purple-600" />
                  Contraste e Visibilidade
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nível de Contraste
                    </label>
                    <select
                      value={settings.contrast}
                      onChange={(e) => handleSettingChange('contrast', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="normal">Normal</option>
                      <option value="high">Alto</option>
                      <option value="maximum">Máximo</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Modo alto contraste
                      </span>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Idioma */}
          {activeTab === 'language' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaGlobe className="text-indigo-600" />
                  Idioma e Região
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Idioma
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ value: 'pt', label: 'Português', flag: '🇧🇷' }, { value: 'en', label: 'English', flag: '🇺🇸' }].map((lang) => {
                        const isActive = i18n.language === lang.value;
                        return (
                          <button
                            key={lang.value}
                            onClick={() => handleLanguageChange(lang.value)}
                            className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-colors duration-200 ${isActive ? 'bg-green-600 text-white border-green-700' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-green-900'}`}
                            aria-pressed={isActive}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="text-sm font-medium">{lang.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fuso Horário
                    </label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                      <option value="America/New_York">Nova York (GMT-5)</option>
                      <option value="Europe/London">Londres (GMT+0)</option>
                      <option value="Asia/Tokyo">Tóquio (GMT+9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Formato de Data
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaDatabase className="text-indigo-600" />
                  Configurações Regionais
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Moeda
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="BRL">Real Brasileiro (R$)</option>
                      <option value="USD">Dólar Americano ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-800 dark:text-indigo-200 mb-2">
                      Configurações Atuais
                    </h4>
                    <div className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                      <p>Idioma: {i18n.language === 'pt' ? 'Português' : 'English'}</p>
                      <p>Tema: {themeMode === 'light' ? 'Claro' : themeMode === 'dark' ? 'Escuro' : 'Automático'}</p>
                      <p>Fuso: {settings.timezone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Notificações */}
          {activeTab === 'notifications' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaBell className="text-blue-600" />
                  Notificações por Email
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Notificações gerais por email' },
                    { key: 'achievementNotifications', label: 'Conquistas e badges' },
                    { key: 'rankingNotifications', label: 'Atualizações do ranking' },
                    { key: 'weeklyReports', label: 'Relatórios semanais' },
                    { key: 'marketingEmails', label: 'Emails promocionais' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {item.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaMobile className="text-blue-600" />
                  Notificações Push
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Notificações push no navegador
                      </span>
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Configurações de Som
                    </h4>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-3 py-1 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
                        <FaVolumeUp className="text-sm" />
                        <span className="text-sm">Som</span>
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        <FaVolumeMute className="text-sm" />
                        <span className="text-sm">Mudo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Privacidade */}
          {activeTab === 'privacy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" />
                  Visibilidade do Perfil
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Visibilidade do Perfil
                    </label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="public">Público</option>
                      <option value="friends">Apenas Amigos</option>
                      <option value="private">Privado</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.showEmail}
                          onChange={(e) => handleSettingChange('showEmail', e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Mostrar email no perfil
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={settings.showPhone}
                          onChange={(e) => handleSettingChange('showPhone', e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Mostrar telefone no perfil
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaUserSecret className="text-green-600" />
                  Coleta de Dados
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.allowDataCollection}
                        onChange={(e) => handleSettingChange('allowDataCollection', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Permitir coleta de dados para melhorias
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.allowAnalytics}
                        onChange={(e) => handleSettingChange('allowAnalytics', e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Permitir analytics
                      </span>
                    </label>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Sua Privacidade
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Seus dados são protegidos e nunca compartilhados com terceiros sem sua permissão.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Acessibilidade */}
          {activeTab === 'accessibility' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaEye className="text-orange-600" />
                  Acessibilidade
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.highContrast}
                      onChange={e => handleSettingChange('highContrast', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Alto contraste</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.reduceMotion}
                      onChange={e => handleSettingChange('reduceMotion', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Reduzir movimento</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.screenReader}
                      onChange={e => handleSettingChange('screenReader', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Compatibilidade com leitor de tela</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.keyboardNavigation}
                      onChange={e => handleSettingChange('keyboardNavigation', e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Navegação por teclado</span>
                  </label>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaKeyboard className="text-orange-600" />
                  Navegação
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.keyboardNavigation}
                        onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Navegação por teclado
                      </span>
                    </label>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                      Atalhos de Teclado
                    </h4>
                    <div className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                      <p>• Tab: Navegar entre elementos</p>
                      <p>• Enter: Ativar botões</p>
                      <p>• Esc: Fechar modais</p>
                      <p>• Ctrl + B: Abrir/fechar sidebar</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Dados */}
          {activeTab === 'data' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaDatabase className="text-teal-600" />
                  Backup e Sincronização
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Backup automático
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Frequência de Backup
                    </label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="daily">Diário</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensal</option>
                    </select>
                  </div>

                  <Button
                    onClick={() => setShowExportModal(true)}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <FaDownload className="mr-2" />
                    Exportar Dados
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaTrash className="text-red-600" />
                  Gerenciar Conta
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      ⚠️ Ação Irreversível
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Esta ação deletará permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.
                    </p>
                    <Button
                      onClick={() => setShowDeleteModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <FaTrash className="mr-2" />
                      Deletar Conta
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Segurança */}
          {activeTab === 'security' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaLock className="text-red-600" />
                  Autenticação
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Autenticação de dois fatores
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timeout da Sessão (minutos)
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={15}>15 minutos</option>
                      <option value={30}>30 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={120}>2 horas</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.loginNotifications}
                        onChange={(e) => handleSettingChange('loginNotifications', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Notificar novos logins
                      </span>
                    </label>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FaShieldAlt className="text-red-600" />
                  Segurança da Conta
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Status da Segurança
                    </h4>
                    <div className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      <p>• Senha: Forte</p>
                      <p>• 2FA: {settings.twoFactorAuth ? 'Ativado' : 'Desativado'}</p>
                      <p>• Último login: Hoje às 14:30</p>
                    </div>
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    <FaLock className="mr-2" />
                    Alterar Senha
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal de Exportação */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Exportar Dados"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Seus dados serão exportados em formato JSON. Isso inclui seu perfil, conquistas, histórico de descartes e configurações.
          </p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={exportData}
              disabled={exporting}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {exporting ? (
                <>
                  <FaSync className="mr-2 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" />
                  Exportar
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Deletar Conta */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Deletar Conta"
      >
        <div className="p-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
              ⚠️ Ação Irreversível
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300">
              Esta ação deletará permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={deleteAccount}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <FaSync className="mr-2 animate-spin" />
                  Deletando...
                </>
              ) : (
                <>
                  <FaTrash className="mr-2" />
                  Deletar Conta
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 