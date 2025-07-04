import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import supabase from '../utils/supabaseClient';
import { CARGOS } from '../constants/cargos';
import Lottie from 'lottie-react';
import editProfileAnimation from '../lottie/edit_profile_animation.json';
import saveProfileAnimation from '../lottie/save_profile_animation.json';

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
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 mb-4">
          <Lottie autoplay loop src={editProfileAnimation} style={{ width: '100%', height: '100%' }} />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Meu Perfil</h2>
      </div>
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
          <select
            value={cargo}
            onChange={e => setCargo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecione...</option>
            {CARGOS.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </optgroup>
            ))}
          </select>
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
        {success && (
          <div className="flex flex-col items-center mt-4 animate-fadeIn">
            <div className="w-32 h-32 mb-2">
              <Lottie autoplay src={saveProfileAnimation} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="text-green-600 font-semibold">Perfil atualizado com sucesso!</div>
          </div>
        )}
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ProfilePage; 