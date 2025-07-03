import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, AppStateProvider } from './hooks';
import Layout from './components/Layout';
import SEO from './components/SEO';
import { Loading } from './components/ui/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import RewardsPage from './pages/RewardsPage';
import AchievementsPage from './pages/AchievementsPage';
import RankingPage from './pages/RankingPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import SettingsPage from './pages/SettingsPage';
import ColetaAgendadaPage from './pages/ColetaAgendadaPage';

// Lazy loading de todas as páginas
const Home = React.lazy(() => import('./pages/Home'));
const AppPage = React.lazy(() => import('./pages/AppPage'));
const KitPage = React.lazy(() => import('./pages/KitPage'));
const ImpactPage = React.lazy(() => import('./pages/ImpactPage'));
const SobreNos = React.lazy(() => import('./pages/SobreNos'));
const SobreProjeto = React.lazy(() => import('./pages/SobreProjeto'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const Admin = React.lazy(() => import('./pages/Admin'));

// Novas páginas
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const CollectPointsPage = React.lazy(() => import('./pages/CollectPointsPage'));

// Initialize i18n
import './i18n.js';

// Initialize analytics
import './utils/analytics';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Componente de loading para Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loading size="lg" text="Carregando página..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppStateProvider>
              <SEO 
                title="Início"
                description="Plataforma Completa de Educação Ambiental com Gamificação Avançada"
                keywords={['reciclagem', 'sustentabilidade', 'educação ambiental', 'gamificação']}
              />
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      {/* Rotas públicas */}
                      <Route path="/" element={<Home />} />
                      <Route path="/app" element={<AppPage />} />
                      <Route path="/kit" element={<KitPage />} />
                      <Route path="/impacto" element={<ImpactPage />} />
                      <Route path="/sobre-nos" element={<SobreNos />} />
                      <Route path="/sobre-projeto" element={<SobreProjeto />} />
                      <Route path="/contato" element={<ContactPage />} />
                      
                      {/* Rotas de autenticação */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/cadastro" element={<RegisterPage />} />
                      
                      {/* Rotas agora públicas (antes protegidas) */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <UserDashboard />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/collect-points" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <CollectPointsPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/recompensas" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <RewardsPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/conquistas" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <AchievementsPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/ranking" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <RankingPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/historico" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <HistoryPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/perfil" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <ProfilePage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/notificacoes" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <NotificationsPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/suporte" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <SupportPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route 
                        path="/configuracoes" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <SettingsPage />
                          </Suspense>
                        } 
                      />
                      
                      <Route path="/coleta-agendada" element={<ColetaAgendadaPage />} />
                      
                      {/* Rota admin - agora pública também */}
                      <Route 
                        path="/admin" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <Admin />
                          </Suspense>
                        } 
                      />
                      
                      {/* Rota antiga do dashboard (redirecionar) */}
                      <Route 
                        path="/dashboard-old" 
                        element={
                          <Suspense fallback={<Loading />}>
                            <Dashboard />
                          </Suspense>
                        } 
                      />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </Layout>
            </AppStateProvider>
          </AuthProvider>
          
          {/* React Query DevTools - only in development */}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App; 