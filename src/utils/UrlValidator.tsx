
import React, { useState } from 'react';

interface UrlValidatorProps {
  onValidUrl?: (url: string) => void;
  className?: string;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  url?: string;
}

const UrlValidator: React.FC<UrlValidatorProps> = ({ onValidUrl, className = '' }) => {
  const [url, setUrl] = useState<string>('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const validateUrl = async (urlToValidate: string): Promise<ValidationResult> => {
    if (!urlToValidate.trim()) {
      return { isValid: false, message: 'URL não pode estar vazia' };
    }

    try {
      const urlObj = new URL(urlToValidate);
      
      // Check if it's a valid HTTP/HTTPS URL
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, message: 'URL deve usar protocolo HTTP ou HTTPS' };
      }

      // Try to fetch the URL to check if it's accessible
      setIsValidating(true);
      
      try {
        const response = await fetch(urlToValidate, { 
          method: 'HEAD',
          mode: 'no-cors' // Para evitar problemas de CORS
        });
        
        return { 
          isValid: true, 
          message: 'URL válida e acessível',
          url: urlToValidate 
        };
      } catch (fetchError) {
        // If HEAD request fails, the URL might still be valid but not accessible
        return { 
          isValid: true, 
          message: 'URL válida (acessibilidade não verificada)',
          url: urlToValidate 
        };
      }
      
    } catch (error) {
      return { isValid: false, message: 'Formato de URL inválido' };
    } finally {
      setIsValidating(false);
    }
  };

  const handleValidate = async (): Promise<void> => {
    const result = await validateUrl(url);
    setValidation(result);
    
    if (result.isValid && result.url && onValidUrl) {
      onValidUrl(result.url);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value);
    setValidation(null); // Clear previous validation
  };

  const getValidationColor = (): string => {
    if (!validation) return 'text-gray-500';
    return validation.isValid ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={handleInputChange}
          placeholder="Digite a URL para validar"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleValidate}
          disabled={isValidating || !url.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isValidating ? 'Validando...' : 'Validar'}
        </button>
      </div>
      
      {validation && (
        <div className={`text-sm ${getValidationColor()}`}>
          {validation.message}
        </div>
      )}
    </div>
  );
};

export default UrlValidator;
