import { ValidationResult } from './types';

export function success(
  value: string,
  message = 'Looks good',
): ValidationResult {
  return {
    valid: true,
    state: 'success',
    message,
    formattedValue: value,
  };
}

export function error(
  value: string,
  message: string,
): ValidationResult {
  return {
    valid: false,
    state: 'error',
    message,
    formattedValue: value,
  };
}

export function typing(
  value: string,
  message = '',
): ValidationResult {
  return {
    valid: false,
    state: 'typing',
    message,
    formattedValue: value,
  };
}

export function warning(
  value: string,
  message: string,
): ValidationResult {
  return {
    valid: false,
    state: 'warning',
    message,
    formattedValue: value,
  };
}

export function idle(): ValidationResult {
  return {
    valid: false,
    state: 'idle',
    message: '',
    formattedValue: '',
  };
}