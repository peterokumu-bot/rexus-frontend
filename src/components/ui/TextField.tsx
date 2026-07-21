'use client';

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

import { validators, ValidationType } from '@/lib/validation';
import { ValidationResult } from '@/lib/validation/types';

export interface TextFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  helperText?: string;

  validationType?: ValidationType;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  showPasswordToggle?: boolean;

  validateOnChange?: boolean;

  validateOnBlur?: boolean;

  successMessage?: string;

  fullWidth?: boolean;
}

const TextField = forwardRef<
  HTMLInputElement,
  TextFieldProps
>(
  (
    {
      label,

      helperText,

      validationType,

      leftIcon,

      rightIcon,

      showPasswordToggle = false,

      validateOnChange = true,

      validateOnBlur = true,

      successMessage,

      className = '',

      fullWidth = true,

      required,

      disabled,

      value,

      onChange,

      onBlur,

      type = 'text',

      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] =
      useState(
        typeof value === 'string'
          ? value
          : '',
      );

    const [touched, setTouched] =
      useState(false);

    const [showPassword, setShowPassword] =
      useState(false);

    const [validation, setValidation] =
      useState<ValidationResult | null>(
        null,
      );

      useEffect(() => {
  if (typeof value === 'string') {
    setInternalValue(value);
  }
}, [value]);

    const currentValue =
      typeof value === 'string'
        ? value
        : internalValue;

    const validator = useMemo(() => {
      if (!validationType) {
        return null;
      }

      return validators[validationType];
    }, [validationType]);

    useEffect(() => {
      if (
        !validator ||
        !validateOnChange
      ) {
        return;
      }

      const result =
        validator.validate(
          currentValue,
        );

      setValidation(result);
    }, [
      currentValue,
      validator,
      validateOnChange,
    ]);

    const inputType =
      type === 'password' &&
      showPassword
        ? 'text'
        : type;

    function handleChange(
      e: React.ChangeEvent<HTMLInputElement>,
    ) {
      let nextValue =
        e.target.value;

      /**
       * Phone numbers
       */

      if (
        validationType ===
        'phone-ke'
      ) {
        nextValue =
          nextValue.replace(
            /\D/g,
            '',
          );

        if (
          nextValue.length > 10
        ) {
          nextValue =
            nextValue.slice(
              0,
              10,
            );
        }
      }

      /**
       * Emails
       */

      if (
        validationType ===
        'email'
      ) {
        nextValue =
          nextValue
            .trimStart()
            .toLowerCase();
      }

      setInternalValue(
        nextValue,
      );

      if (onChange) {
        const clonedEvent = {
          ...e,
          target: {
            ...e.target,
            value: nextValue,
          },
        };

        onChange(
          clonedEvent as React.ChangeEvent<HTMLInputElement>,
        );
      }
    }

    function handleBlur(
      e: React.FocusEvent<HTMLInputElement>,
    ) {
      setTouched(true);

      if (
        validator &&
        validateOnBlur
      ) {
        setValidation(
          validator.validate(
            currentValue,
          ),
        );
      }

      onBlur?.(e);
    }

    const borderClass =
      validation?.state ===
      'success'
        ? 'border-green-500'

        : validation?.state ===
          'warning'
        ? 'border-yellow-500'

        : validation?.state ===
          'error'
        ? 'border-red-500'

        : 'border-rexo';

    const focusClass =
      validation?.state ===
      'success'
        ? 'focus:ring-green-500/20 focus:border-green-500'

        : validation?.state ===
          'error'
        ? 'focus:ring-red-500/20 focus:border-red-500'

        : 'focus:ring-rexo-primary/20 focus:border-rexo-primary';

    const messageColor =
      validation?.state ===
      'success'
        ? 'text-green-600'

        : validation?.state ===
          'warning'
        ? 'text-yellow-600'

        : validation?.state ===
          'error'
        ? 'text-red-500'

        : 'text-rexo-muted';

    const statusIcon =
      validation?.state ===
      'success' ? (
        <CheckCircle2
          size={18}
          className="text-green-500"
        />
      ) : validation?.state ===
        'warning' ? (
        <AlertCircle
          size={18}
          className="text-yellow-500"
        />
      ) : validation?.state ===
        'error' ? (
        <AlertCircle
          size={18}
          className="text-red-500"
        />
      ) : (
        <Info
          size={18}
          className="text-gray-400"
        />
      );

    const widthClass =
      fullWidth
        ? 'w-full'
        : '';

    return (
      <div
        className={widthClass}
      >
        {label && (
          <label
            className="
              mb-2
              flex
              items-center
              gap-1
              text-sm
              font-semibold
              text-rexo
            "
          >
            {label}

            {required && (
              <span className="text-red-500">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
                      {leftIcon && (
            <div
              className="
                absolute
                left-4
                top-1/2
                z-10
                -translate-y-1/2
                text-gray-400
              "
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            value={currentValue}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={validation?.state === 'error'}
            aria-describedby={
              validation || helperText
                ? `${props.id ?? props.name}-helper`
                : undefined
            }
            className={`
              ${widthClass}
              rounded-input
              bg-white
              py-3
              text-rexo
              outline-none
              transition-all
              duration-200

              ${leftIcon ? 'pl-12' : 'pl-4'}

              ${
                rightIcon || showPasswordToggle
                  ? 'pr-12'
                  : 'pr-4'
              }

              ${borderClass}

              ${focusClass}

              disabled:cursor-not-allowed
              disabled:bg-gray-100

              ${className}
            `}
            {...props}
          />

          {/* Right Icon */}

          {!showPasswordToggle &&
            rightIcon && (
              <div
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >
                {rightIcon}
              </div>
            )}

          {/* Password Toggle */}

          {showPasswordToggle &&
            type === 'password' && (
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  transition
                  hover:text-rexo-primary
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            )}

        </div>

        {/* Validation Message */}

        {(validation || helperText) && (

          <div
            id={`${props.id ?? props.name}-helper`}
            className="
              mt-2
              flex
              items-start
              gap-2
              text-sm
            "
          >

            {statusIcon}

            <span className={messageColor}>

              {validation?.message ||
                helperText}

            </span>

          </div>

        )}

        {/* Password Strength */}

        {validationType ===
          'password' &&
          validation?.score !==
            undefined && (

            <div className="mt-4">

              <div className="mb-2 flex justify-between text-xs">

                <span>
                  Password Strength
                </span>

                <span className="font-semibold">

                  {validation.score}
                  %

                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-200">

                <div
                  className={`
                    h-full
                    transition-all
                    duration-300

                    ${
                      validation.score <
                      40
                        ? 'bg-red-500'
                        : validation.score <
                          80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }
                  `}
                  style={{
                    width: `${validation.score}%`,
                  }}
                />

              </div>

            </div>

          )}

        {/* Password Checklist */}

        {validationType ===
          'password' &&
          validation?.checklist && (

            <div className="mt-4 space-y-2 text-sm">

              <ChecklistItem
                ok={
                  validation
                    .checklist
                    .minLength
                }
                label="At least 8 characters"
              />

              <ChecklistItem
                ok={
                  validation
                    .checklist
                    .uppercase
                }
                label="Uppercase letter"
              />

              <ChecklistItem
                ok={
                  validation
                    .checklist
                    .lowercase
                }
                label="Lowercase letter"
              />

              <ChecklistItem
                ok={
                  validation
                    .checklist.number
                }
                label="Number"
              />

              <ChecklistItem
                ok={
                  validation
                    .checklist.special
                }
                label="Special character"
              />

            </div>

          )}

      </div>

    );
  },
);

TextField.displayName =
  'TextField';

interface ChecklistItemProps {
  ok: boolean;
  label: string;
}

function ChecklistItem({
  ok,
  label,
}: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2
        size={16}
        className={
          ok
            ? 'text-green-500'
            : 'text-gray-300'
        }
      />

      <span
        className={
          ok
            ? 'text-green-600'
            : 'text-gray-500'
        }
      >
        {label}
      </span>

    </div>
  );
}

export default TextField;