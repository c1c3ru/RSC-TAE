// tests/validators.test.js
import { validatePasswordStrength, validateInstitutionalEmail } from '../src/utils/validators';

describe('Validators', () => {
  test('validatePasswordStrength deve retornar true para senha forte', () => {
    expect(validatePasswordStrength('Senha123!')).toBe(true);
  });

  test('validateInstitutionalEmail deve validar emails .edu', () => {
    expect(validateInstitutionalEmail('user@domain.edu.br')).toBe(true);
    expect(validateInstitutionalEmail('user@gmail.com')).toBe(false);
  });
});