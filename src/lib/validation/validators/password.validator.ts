import {
  error,
  success,
  typing,
} from '../helpers';

import {
  ValidationResult,
  Validator,
} from '../types';

const COMMON_PASSWORDS = [
  'password',
  'password123',
  '123456',
  '12345678',
  '123456789',
  'qwerty',
  'admin',
  'welcome',
  'abc123',
];

class PasswordValidator implements Validator {

  validate(value: string): ValidationResult {

    if (!value) {
      return typing(
        '',
        'Create a secure password',
      );
    }

    const checklist = {
      minLength: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z0-9]/.test(value),
    };

    let score = 0;

    Object.values(checklist).forEach((item) => {
      if (item) score += 20;
    });

    const lower = value.toLowerCase();

    if (COMMON_PASSWORDS.includes(lower)) {
      return {
        valid: false,
        state: 'error',
        message: 'This password is too common',
        formattedValue: value,
        score: 0,
        checklist,
      };
    }

    if (score < 40) {
      return {
        valid: false,
        state: 'warning',
        message: 'Weak password',
        formattedValue: value,
        score,
        checklist,
      };
    }

    if (score < 80) {
      return {
        valid: false,
        state: 'warning',
        message: 'Good password. Add more complexity.',
        formattedValue: value,
        score,
        checklist,
      };
    }

    return {
      ...success(
        value,
        '✔ Excellent password',
      ),
      score,
      checklist,
    };
  }

  strength(score: number) {
    if (score < 40) return 'Weak';

    if (score < 80) return 'Good';

    return 'Excellent';
  }
}

export const passwordValidator =
  new PasswordValidator();

export default passwordValidator;