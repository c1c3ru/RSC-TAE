import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabaseClient';

const ProfilePage = () => {
  const { currentUser, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [cargo, setCargo] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.user_metadata?.nome || currentUser.name || '');
      setCargo(currentUser.user_metadata?.cargo || currentUser.job || '');
      setEscolaridade(currentUser.user_metadata?.escolaridade || currentUser.escolaridade || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Atualiza na tabela user_profile
      const { error: updateError } = await supabase
        .from('user_profile')
        .update({ name, job: cargo, escolaridade })
        .eq('id', currentUser.id);
      if (updateError) throw updateError;
      setSuccess(true);
      refreshUser?.();
    } catch (err) {
      setError('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Meu Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
          <input
            type="text"
            value={cargo}
            onChange={e => setCargo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Escolaridade</label>
          <select
            value={escolaridade}
            onChange={e => setEscolaridade(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecione...</option>
            <option value="Ensino fundamental incompleto">Ensino fundamental incompleto</option>
            <option value="Ensino fundamental completo">Ensino fundamental completo</option>
            <option value="Ensino médio">Ensino médio</option>
            <option value="Curso técnico">Curso técnico</option>
            <option value="Graduação">Graduação</option>
            <option value="Pós-graduação lato sensu (especialização)">Pós-graduação lato sensu (especialização)</option>
            <option value="Mestrado">Mestrado</option>
            <option value="Doutorado">Doutorado</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
        {success && <div className="text-green-600 font-semibold mt-2">Perfil atualizado com sucesso!</div>}
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ProfilePage; 