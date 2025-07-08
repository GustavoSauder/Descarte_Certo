import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const GoogleAuthDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        setDebugInfo({
          hasSession: !!session,
          user: session?.user || null,
          error: error?.message || null,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        setDebugInfo({
          hasSession: false,
          user: null,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    };

    checkAuthStatus();
    
    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        checkAuthStatus();
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const testGoogleAuth = async () => {
    try {
      console.log('Testando Google Auth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      console.log('Teste Google Auth:', { data, error });
      alert(error ? `Erro: ${error.message}` : 'Login iniciado com sucesso!');
    } catch (error) {
      console.error('Erro no teste:', error);
      alert(`Erro: ${error.message}`);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white p-2 rounded-full text-xs"
        title="Debug Google Auth"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Google Auth Debug</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div>
          <strong>Session:</strong> {debugInfo.hasSession ? '✅' : '❌'}
        </div>
        
        {debugInfo.user && (
          <div>
            <strong>User:</strong> {debugInfo.user.email}
          </div>
        )}
        
        {debugInfo.error && (
          <div className="text-red-400">
            <strong>Error:</strong> {debugInfo.error}
          </div>
        )}
        
        <div>
          <strong>Timestamp:</strong> {debugInfo.timestamp}
        </div>
        
        <button
          onClick={testGoogleAuth}
          className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Test Google Auth
        </button>
      </div>
    </div>
  );
};

export default GoogleAuthDebug; 