import React, { useState } from 'react';
import { REDIRECT_URLS } from '../config/environment';

const UrlValidator = () => {
  const [validationResults, setValidationResults] = useState([]);

  const validateUrl = (url, name) => {
    const results = [];
    
    // Verificar se a URL existe
    if (!url) {
      results.push({ type: 'error', message: `${name}: URL está vazia` });
      return results;
    }
    
    // Verificar se há espaços
    if (url.includes(' ')) {
      results.push({ type: 'error', message: `${name}: Contém espaços - "${url}"` });
    } else {
      results.push({ type: 'success', message: `${name}: Sem espaços` });
    }
    
    // Verificar se é uma URL válida
    try {
      new URL(url);
      results.push({ type: 'success', message: `${name}: URL válida` });
    } catch (error) {
      results.push({ type: 'error', message: `${name}: URL inválida - ${error.message}` });
    }
    
    // Verificar comprimento
    if (url.length > 200) {
      results.push({ type: 'warning', message: `${name}: URL muito longa (${url.length} caracteres)` });
    } else {
      results.push({ type: 'success', message: `${name}: Comprimento OK (${url.length} caracteres)` });
    }
    
    return results;
  };

  const runValidation = () => {
    const results = [];
    
    // Testar URLs de redirecionamento
    const dashboardUrl = REDIRECT_URLS.dashboard();
    const resetPasswordUrl = REDIRECT_URLS.resetPassword();
    const loginUrl = REDIRECT_URLS.login();
    
    results.push(...validateUrl(dashboardUrl, 'Dashboard URL'));
    results.push(...validateUrl(resetPasswordUrl, 'Reset Password URL'));
    results.push(...validateUrl(loginUrl, 'Login URL'));
    
    // Testar URLs específicas que devem estar no Supabase
    const expectedUrls = [
      'https://rsc-tae.vercel.app/dashboard',
      'https://rsc-tae.vercel.app',
      'http://localhost:5173/dashboard',
      'http://localhost:5173'
    ];
    
    expectedUrls.forEach(url => {
      results.push(...validateUrl(url, `Expected URL: ${url}`));
    });
    
    setValidationResults(results);
  };

  const getResultColor = (type) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">🔗 Validador de URLs</h3>
      
      <button
        onClick={runValidation}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Validar URLs
      </button>

      <div className="space-y-2">
        {validationResults.map((result, index) => (
          <div
            key={index}
            className={`p-2 rounded text-sm ${getResultColor(result.type)}`}
          >
            {result.message}
          </div>
        ))}
      </div>

      {validationResults.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-bold text-blue-800 mb-2">📋 Instruções para Supabase:</h4>
          <p className="text-sm text-blue-700 mb-2">
            Copie e cole estas URLs exatamente no Supabase Dashboard:
          </p>
          <div className="bg-gray-100 p-3 rounded font-mono text-sm">
            <div>URLs de Redirecionamento:</div>
            <div>https://rsc-tae.vercel.app/dashboard</div>
            <div>http://localhost:5173/dashboard</div>
            <br />
            <div>URLs do Site:</div>
            <div>https://rsc-tae.vercel.app</div>
            <div>http://localhost:5173</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlValidator; 