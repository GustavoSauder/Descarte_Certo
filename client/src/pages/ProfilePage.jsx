import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useAppState } from '../hooks/useAppState';

const ProfilePage = () => {
  const { user } = useAuth();
  const { addNotification } = useAppState();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    school: user?.school || '',
    city: user?.city || '',
    state: user?.state || ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Aqui você pode implementar a chamada para atualizar o perfil no backend
          addNotification({
        type: 'success',
        title: 'Sucesso!',
        message: 'Perfil atualizado com sucesso!'
      });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Você não está logado</h2>
          <p className="mb-4">Faça login para visualizar seu perfil.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="w-full py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Meu Perfil</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gerencie suas informações pessoais
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 md:p-8">
            {editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome
                    </label>
                    <input 
                      id="profile-name"
                      name="name" 
                      value={form.name || ''} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="Nome" 
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input 
                      id="profile-email"
                      name="email" 
                      value={form.email || ''} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="Email" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-school" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Escola
                    </label>
                    <input 
                      id="profile-school"
                      name="school" 
                      value={form.school || ''} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="Escola" 
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cidade
                    </label>
                    <input 
                      id="profile-city"
                      name="city" 
                      value={form.city || ''} 
                      onChange={handleChange} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                      placeholder="Cidade" 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="profile-state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estado
                  </label>
                  <input 
                    id="profile-state"
                    name="state" 
                    value={form.state || ''} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" 
                    placeholder="Estado" 
                  />
                </div>
                
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleSave} className="px-8">Salvar</Button>
                  <Button onClick={() => setEditing(false)} variant="secondary" className="px-8">Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome
                    </label>
                    <p className="text-lg font-medium">{user?.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <p className="text-lg font-medium">{user?.email || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Escola
                    </label>
                    <p className="text-lg font-medium">{user?.school || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cidade
                    </label>
                    <p className="text-lg font-medium">{user?.city || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Estado
                    </label>
                    <p className="text-lg font-medium">{user?.state || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <Button onClick={() => setEditing(true)} className="px-8">
                    Editar Perfil
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 