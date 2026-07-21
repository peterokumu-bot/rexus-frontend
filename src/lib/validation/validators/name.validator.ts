import {
  error,
  success,
  typing,
} from '../helpers';

import {
  ValidationResult,
  Validator,
} from '../types';

class NameValidator implements Validator {

  validate(value: string): ValidationResult {

    const formatted =
      this.normalize(value);

    if (!formatted) {

      return typing(
        '',
        'Enter your name',
      );

    }

    if (formatted.length < 2) {

      return error(
        formatted,
        'Name must contain at least 2 characters',
      );

    }

    if (formatted.length > 50) {

      return error(
        formatted,
        'Name is too long',
      );

    }

    // Allows:
    // Peter
    // Mary Anne
    // John-Paul
    // Ochieng'

    const regex =
      /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (!regex.test(formatted)) {

      return error(
        formatted,
        'Only letters, spaces, hyphens and apostrophes are allowed',
      );

    }

    return success(
      formatted,
      '✔ Looks good',
    );

  }

  normalize(value: string): string {

    return value

      .trim()

      .replace(/\s+/g, ' ')

      .toLowerCase()

      .split(' ')

      .map((word) =>
        word
          .split('-')
          .map(
            (part) =>
              part.charAt(0).toUpperCase() +
              part.slice(1),
          )
          .join('-'),
      )

      .join(' ');

  }

}

export const nameValidator =
  new NameValidator();

export default nameValidator;