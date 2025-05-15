// src/utils/helpers.js
/**
 * Funções auxiliares para manipulação de dados
 */

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de datas localizada
export const formatDate = (dateString, pattern = 'dd/MM/yyyy') => {
  try {
    return format(parseISO(dateString), pattern, { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

// Cálculo de pontos acumulados
export const calculateTotalPoints = (activities) => {
  return Object.values(activities).reduce((acc, curr) => {
    return acc + (curr.quantity * curr.pointsPerUnit);
  }, 0);
};

// Normalização de texto para buscas
export const normalizeString = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// Truncagem de texto com elipse
export const truncateText = (text, maxLength = 100) => {
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
};

// Formatação de números brasileiros
export const formatNumber = (number) => {
  return new Intl.NumberFormat('pt-BR').format(number);
};

// Filtragem segura de documentos
export const filterSecureDocuments = (documents) => {
  return documents.filter(doc => {
    try {
      const url = new URL(doc);
      return url.protocol === 'https:';
    } catch {
      return false;
    }
  });
};

// Conversão de base64 para Blob seguro
export const base64ToBlob = (base64, contentType = '') => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
};