
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface ServerStatusProps {
  className?: string;
}

interface StatusInfo {
  isOnline: boolean;
  lastChecked: Date;
  responseTime?: number;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<StatusInfo>({
    isOnline: false,
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkServerStatus = async (): Promise<void> => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.from('user_profile').select('count').limit(1);
      const responseTime = Date.now() - startTime;
      
      setStatus({
        isOnline: !error,
        lastChecked: new Date(),
        responseTime
      });
    } catch (error) {
      console.error('Erro ao verificar status do servidor:', error);
      setStatus({
        isOnline: false,
        lastChecked: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (): string => {
    if (isChecking) return 'bg-yellow-500';
    return status.isOnline ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (): string => {
    if (isChecking) return 'Verificando...';
    return status.isOnline ? 'Online' : 'Offline';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
      <span className="text-sm text-gray-600">
        {getStatusText()}
        {status.responseTime && status.isOnline && (
          <span className="ml-1 text-xs">({status.responseTime}ms)</span>
        )}
      </span>
      <button
        onClick={checkServerStatus}
        disabled={isChecking}
        className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        Verificar
      </button>
    </div>
  );
};

export default ServerStatus;
