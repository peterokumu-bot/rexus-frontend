'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import api from '@/lib/api';
import { useApp } from '@/context/AppContext';

import AuthCard from '@/components/auth/AuthCard';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthFooter from '@/components/auth/AuthFooter';

import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();

  const { refreshAppData } = useApp();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      email: '',
      password: '',
      rememberMe: false,
    });

  function updateField(
    field: keyof typeof form,
    value: string | boolean,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function login() {
    if (
      !form.email.trim() ||
      !form.password.trim()
    ) {
      toast.error(
        'Please enter your email and password.',
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post('/auth/login', {
          email: form.email.trim(),
          password: form.password,
        });

      localStorage.setItem(
        'token',
        response.data.access_token,
      );

      // Reserved for future implementation
      if (form.rememberMe) {
        localStorage.setItem(
          'rememberMe',
          'true',
        );
      }

      await refreshAppData();

      toast.success(
        'Welcome back to Rexo!',
      );

      router.replace('/');

    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ??
          'Invalid email or password.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-rexo-background px-6 py-12">

      <AuthCard>

        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to continue discovering thoughtful gifts, track your orders and manage your Rexo account."
        />

        <div className="space-y-5">

          <TextField
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            autoComplete="email"
            validationType="email"
            value={form.email}
            onChange={(e) =>
              updateField(
                'email',
                e.target.value,
              )
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                form.password
              ) {
                login();
              }
            }}
          />

          <TextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            autoComplete="current-password"
            showPasswordToggle
            value={form.password}
            onChange={(e) =>
              updateField(
                'password',
                e.target.value,
              )
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                login();
              }
            }}
          />

          <div className="flex items-center justify-between">

            <label className="flex items-center gap-2 text-sm text-rexo-muted">

              <input
                type="checkbox"
                checked={form.rememberMe}
                onChange={(e) =>
                  updateField(
                    'rememberMe',
                    e.target.checked,
                  )
                }
                className="h-4 w-4 rounded border-rexo text-rexo-primary focus:ring-rexo-primary"
              />

              Remember me

            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-rexo-primary hover:underline"
            >
              Forgot Password?
            </Link>

          </div>

          <Button
            fullWidth
            loading={loading}
            disabled={
              loading ||
              !form.email.trim() ||
              !form.password.trim()
            }
            onClick={login}
          >
            Sign In
          </Button>

          <Button
            fullWidth
            variant="outline"
            onClick={() =>
              router.push('/')
            }
          >
            Continue as Guest
          </Button>

        </div>

        <AuthFooter
          text="New to Rexo?"
          linkText="Create an Account"
          href="/register"
        />

      </AuthCard>

    </main>
  );
}