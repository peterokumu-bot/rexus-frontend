export type ValidationState =
  | 'idle'
  | 'typing'
  | 'success'
  | 'warning'
  | 'error';

export interface ValidationResult {
  valid: boolean;

  state: ValidationState;

  message: string;

  formattedValue: string;

  score?: number;

  checklist?: {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };

  suggestion?: string;

  metadata?: Record<string, unknown>;
}

export interface Validator {

  validate(
    value: string,
  ): ValidationResult;

}