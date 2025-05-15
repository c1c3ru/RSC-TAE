// tests/auth.test.js
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import AuthProvider from '../src/contexts/AuthContext';

describe('Auth Context', () => {
  it('provides initial null user', () => {
    const { getByText } = render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>
    );
    expect(getByText('Test')).toBeInTheDocument();
  });
});