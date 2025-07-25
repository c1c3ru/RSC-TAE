
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CARGOS_TAE } from '../constants/cargos';
import { PROFILE_TEXTS } from '../constants/texts';
import { useLottie } from 'lottie-react';
import editProfileAnimation from '../assets/lottie/edit_profile_animation.json';
import saveProfileAnimation from '../assets/lottie/save_profile_animation.json';
import { supabase } from '../utils/supabaseClient';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [cargo, setCargo] = useState('');
  const [escolaridade, setEscolaridade] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);

  const { View: EditView } = useLottie({
    animationData: editProfileAnimation,
    loop: true,
    autoplay: true
  });

  const { View: SaveView } = useLottie({
    animationData: saveProfileAnimation,
    loop: false,
    autoplay: showSaveAnimation
  });

  // Garantir que View é um elemento React
  const renderEditView = () => {
    return React.isValidElement(EditView) ? EditView : null;
  };
  const renderSaveView = () => {
    return React.isValidElement(SaveView) ? SaveView : null;
  };

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.user_metadata?.nome || '');
      setCargo(currentUser.user_metadata?.cargo || '');
      setEscolaridade(currentUser.user_metadata?.escolaridade || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    if (!currentUser) return;
    try {
      // Atualiza na tabela user_profile
      const { error: updateError } = await supabase
        .from('user_profile')
        .update({ name, functional_category: cargo, education: escolaridade })
        .eq('id', currentUser.id);
      if (updateError) throw updateError;
      setSuccess(true);
      setShowSaveAnimation(true);
    
      setTimeout(() => {
        setShowSaveAnimation(false);
      }, 3000);
    } catch {
      setError(PROFILE_TEXTS.erroSalvar);
    } finally {
      setLoading(false);
      // Removido o timeout automático - agora o usuário precisa clicar em OK
    }
  };

  // Corrigir agrupamento de cargos:
  // Agrupar CARGOS_TAE por nivel e categoria
  const groupedCargos = [
    { label: 'Nível E - Superior', options: CARGOS_TAE.filter(c => c.nivel === 'E').map(c => c.nome) },
    { label: 'Nível D - Técnico', options: CARGOS_TAE.filter(c => c.nivel === 'D').map(c => c.nome) },
    { label: 'Nível C - Apoio', options: CARGOS_TAE.filter(c => c.nivel === 'C').map(c => c.nome) },
  ];

  if (!currentUser) return null;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded-lg shadow-md p-8">
      {/* Botão Voltar */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 mb-4 flex items-center justify-center">
          {renderEditView()}
        </div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{PROFILE_TEXTS.titulo}</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{PROFILE_TEXTS.nomeCompleto}</label>
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
            <option value="">Selecione</option>
            {groupedCargos.map(group => (
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
            <option value="">Selecione</option>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <div className="w-full h-full">
                  {renderSaveView()}
                </div>
              </div>
              <div className="text-green-600 font-semibold text-lg mb-4">Perfil atualizado com sucesso!</div>
              <button
                onClick={() => {
                  setSuccess(false);
                  setShowSaveAnimation(false);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 font-semibold mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default ProfilePage;
