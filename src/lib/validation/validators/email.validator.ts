import {
  error,
  success,
  typing,
} from '../helpers';

import {
  ValidationResult,
  Validator,
} from '../types';

const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'proton.me',
];

class EmailValidator implements Validator {
  validate(value: string): ValidationResult {
    const email = value.trim().toLowerCase();

    if (!email) {
      return typing(
        '',
        'Enter your email address',
      );
    }

    // User still typing
    if (!email.includes('@')) {
      return typing(
        email,
        'Email must contain @',
      );
    }

    const parts = email.split('@');

    if (parts.length !== 2) {
      return error(
        email,
        'Invalid email format',
      );
    }

    const [username, domain] = parts;

    if (!username.length) {
      return error(
        email,
        'Missing username',
      );
    }

    if (!domain.length) {
      return typing(
        email,
        'Continue typing your email',
      );
    }

    if (!domain.includes('.')) {
      return typing(
        email,
        'Complete your email domain',
      );
    }

    const regex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!regex.test(email)) {
      return error(
        email,
        'Invalid email address',
      );
    }

    const suggestion =
      this.findSuggestion(domain);

    if (suggestion) {
      return {
        valid: false,
        state: 'warning',
        message: `Did you mean ${username}@${suggestion}?`,
        formattedValue: email,
        metadata: {
          suggestion,
        },
      };
    }

    return success(
      email,
      '✔ Valid email address',
    );
  }

  normalize(value: string): string {
    return value
      .trim()
      .toLowerCase();
  }

  private findSuggestion(
    domain: string,
  ): string | null {
    const mistakes: Record<string, string> = {
      'gmail.con': 'gmail.com',
      'gmail.co': 'gmail.com',
      'gmail.cm': 'gmail.com',

      'yahoo.con': 'yahoo.com',
      'yahoo.co': 'yahoo.com',

      'outlok.com': 'outlook.com',
      'outlook.con': 'outlook.com',

      'hotmal.com': 'hotmail.com',

      'iclod.com': 'icloud.com',
    };

    if (mistakes[domain]) {
      return mistakes[domain];
    }

    return COMMON_DOMAINS.includes(domain)
      ? null
      : null;
  }
}

export const emailValidator =
  new EmailValidator();

export default emailValidator;