'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useApp } from '@/context/AppContext';
import {
  normalizeName,
  isValidFullName,
  normalizeEmail,
  isValidEmail,
  sanitizePhoneInput,
  isValidPhone,
} from '@/common/utils';
import { register } from 'next/dist/next-devtools/userspace/pages/pages-dev-overlay-setup';

export default function RegisterPage() {

  const router = useRouter();

  const { refreshAppData } =
    useApp();

  const [firstName, setFirstName] =
    useState('');

  const [lastName, setLastName] =
    useState('');

  const [email, setEmail] =
    useState('');

    const [phone, setPhone] =
  useState('');

const [dateOfBirth, setDateOfBirth] =
  useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const passwordsMatch =
    password === confirmPassword;

  const validPassword =
    password.length >= 8;

   const firstNameValid =
  /^[A-Za-z]{2,}$/.test(
    firstName.trim(),
  );

const lastNameValid =
  /^[A-Za-z]{2,}$/.test(
    lastName.trim(),
  );

const emailValid =
  isValidEmail(email);

const phoneValid =
  isValidPhone(phone);

  async function register() {

    try {

        if (!firstNameValid) {

  alert(
    'First name must be at least 2 letters',
  );

  return;

}

if (!lastNameValid) {

  alert(
    'Last name must be at least 2 letters',
  );

  return;

}

if (!emailValid) {

  alert(
    'Please enter a valid email address',
  );

  return;

}

if (!phoneValid) {

  alert(
    'Please enter a valid 10-digit Kenyan phone number',
  );

  return;

}

      if (!passwordsMatch) {

        alert(
          'Passwords do not match',
        );

        return;

      }

      if (!validPassword) {

        alert(
          'Password must be at least 8 characters',
        );

        return;

      }

      setLoading(true);

      const response =
       await api.post(
  '/auth/register',
  {
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    password,
  },
);

      const loginResponse =
        await api.post(
          '/auth/login',
          {
            email,
            password,
          },
        );

      localStorage.setItem(
        'token',
        loginResponse.data.access_token,
      );

      window.dispatchEvent(
        new Event('storage'),
      );

      await refreshAppData();

      alert(
        'Registration successful',
      );

      router.push('/');

    } catch (error: any) {

      console.error(error);

      alert(
        error?.response?.data?.message ||
        'Registration failed',
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">

        <h1 className="text-3xl font-bold mb-8">
          Create Account
        </h1>

<input
  placeholder="First Name"
  className="w-full border rounded-xl p-4 mb-4"
  value={firstName}
  onChange={(e) =>
    setFirstName(
      e.target.value,
    )
  }
  onBlur={() =>
    setFirstName(
      normalizeName(
        firstName,
      ),
    )
  }
/>

        <input
          placeholder="Last Name"
          className="w-full border rounded-xl p-4 mb-4"
          value={lastName}
          onChange={(e) =>
            setLastName(
              e.target.value,
            )
          }
            onBlur={() =>
              setLastName(
                normalizeName(
                  lastName,
                ),
              )
            }
        />

         <input
  type="tel"
  placeholder="0701234567"
  className="w-full border rounded-xl p-4 mb-2"
  value={phone}
  onChange={(e) =>
    setPhone(
      sanitizePhoneInput(
        e.target.value,
      ),
    )
  }
/>

{phone && (

  <p
    className={`text-sm mb-4 ${
      phoneValid
        ? 'text-green-600'
        : 'text-red-500'
    }`}
  >
    {phoneValid
      ? '✓ Valid phone number'
      : 'Enter valid Kenyan number'}
  </p>

)}

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border rounded-xl p-4 mb-4"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value,
            )
          }
          onBlur={() =>
            setEmail(
              normalizeEmail(
                email,
              ),
            )
          }
        />

        <div className="mb-4">

  <label className="block text-sm font-medium mb-2">
    Date of Birth
  </label>

  <input
    type="date"
    value={dateOfBirth}
    onChange={(e) =>
      setDateOfBirth(
        e.target.value,
      )
    }
    className="w-full border rounded-xl p-4"
  />

</div>

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl p-4"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value,
            )
          }
        />

        {password && (

          <p
            className={`text-sm mt-2 ${
              validPassword
                ? 'text-green-600'
                : 'text-red-500'
            }`}
          >
            {validPassword
              ? '✓ Strong password'
              : 'Minimum 8 characters'}
          </p>

        )}

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border rounded-xl p-4 mt-4"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value,
            )
          }
        />

        {confirmPassword && (

          <p
            className={`text-sm mt-2 ${
              passwordsMatch
                ? 'text-green-600'
                : 'text-red-500'
            }`}
          >
            {passwordsMatch
              ? '✓ Passwords match'
              : 'Passwords do not match'}
          </p>

        )}


        <button
          onClick={register}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold"
        >
          {loading
            ? 'Creating Account...'
            : 'Create Account'}
        </button>

        <div className="mt-6 text-center">

          <p className="text-gray-600">
            Already have an account?
          </p>

          <button
            onClick={() =>
              router.push('/login')
            }
            className="mt-2 text-pink-600 font-semibold hover:underline"
          >
            Login Instead
          </button>

        </div>

      </div>

    </main>

  );

}