// src/utils/validators.js
/**
 * Validações de segurança e integridade de dados
 */

// Validação de email institucional
export const validateInstitutionalEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(edu|gov|org)(\.[a-zA-Z]{2,})?$/;
  return regex.test(email);
};

// Validação de força de senha
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/;
  const hasNumber = /[0-9]/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

  return (
    password.length >= minLength &&
    hasUpperCase.test(password) &&
    hasNumber.test(password) &&
    hasSpecialChar.test(password)
  );
};

// Validação de tipo de arquivo para documentos comprobatórios
export const validateFileType = (file) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return allowedTypes.includes(file.type);
};

// Validação de URL segura
export const validateSecureURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

// Validação de pontuação numérica
export const validateNumericRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// Validação de campos obrigatórios
export const validateRequiredFields = (obj, fields) => {
  return fields.every(field => {
    const value = obj[field];
    return value !== null && value !== undefined && value !== '';
  });
};