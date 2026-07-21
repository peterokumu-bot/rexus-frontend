import {
  error,
  success,
  typing,
} from '../helpers';

import {
  ValidationResult,
  Validator,
} from '../types';

class PhoneValidator implements Validator {
  validate(value: string): ValidationResult {
    if (!value) {
      return typing(
        '',
        'Enter your Kenyan phone number',
      );
    }

    // Remove spaces, dashes and brackets
    let phone = value.replace(/[^\d+]/g, '');

    // Convert +254XXXXXXXXX → 0XXXXXXXXX
    if (phone.startsWith('+254')) {
      phone = '0' + phone.slice(4);
    }

    // Convert 254XXXXXXXXX → 0XXXXXXXXX
    if (
      phone.startsWith('254') &&
      phone.length === 12
    ) {
      phone = '0' + phone.slice(3);
    }

    // Digits only from here
    phone = phone.replace(/\D/g, '');

    // Still typing
    if (phone.length < 10) {
      return typing(
        phone,
        'Enter a 10-digit Kenyan mobile number',
      );
    }

    // Too long
    if (phone.length > 10) {
      return error(
        phone,
        'Phone number must contain exactly 10 digits',
      );
    }

    // Prefix validation
    if (
      !phone.startsWith('07') &&
      !phone.startsWith('01')
    ) {
      return error(
        phone,
        'Kenyan mobile numbers must begin with 07 or 01',
      );
    }

    return success(
      phone,
      '✔ Valid Kenyan mobile number',
    );
  }

  normalize(value: string): string {
    let phone = value.trim();

    if (phone.startsWith('+254')) {
      phone = '0' + phone.slice(4);
    }

    if (
      phone.startsWith('254') &&
      phone.length === 12
    ) {
      phone = '0' + phone.slice(3);
    }

    return phone.replace(/\D/g, '');
  }

  mask(value: string): string {
    return this.normalize(value);
  }
}

export const phoneValidator =
  new PhoneValidator();

export default phoneValidator;