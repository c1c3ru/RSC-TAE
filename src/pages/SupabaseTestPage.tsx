import React from 'react';
import GoogleLoginDebug from '../components/Debug/GoogleLoginDebug';
import AuthDebug from '../components/Debug/AuthDebug';
import UserTest from '../components/Debug/UserTest';
import RLSTest from '../components/Debug/RLSTest';

const SupabaseTestPage: React.FC = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Página de Testes Supabase/Debug</h1>
      <div className="space-y-6">
        <GoogleLoginDebug onTestLogin={async () => {}} />
        <AuthDebug />
        <UserTest />
        <RLSTest />
      </div>
    </div>
  );
};

export default SupabaseTestPage; 