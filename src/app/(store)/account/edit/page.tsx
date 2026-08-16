'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

import api from '@/lib/api';

import UtilityNavbar from '@/components/layout/UtilityNavbar';
import MainNavbar from '@/components/layout/MainNavbar';
import OccasionBar from '@/components/layout/OccasionBar';
import Container from '@/components/layout/Container';

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');

      const { data } = await api.get('/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmail(data.email ?? '');
      setFirstName(data.firstName ?? '');
      setLastName(data.lastName ?? '');
      setPhone(data.phone ?? '');

      if (data.dateOfBirth) {
        setDateOfBirth(
          data.dateOfBirth.split('T')[0],
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function saveProfile() {
    try {
      const token = localStorage.getItem('token');

      await api.patch(
        '/profile',
        {
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile.');
    }
  }

  if (loading) {
    return (
      <>
        <UtilityNavbar />
        <MainNavbar />
        <OccasionBar />

        <Container className="py-24">
          <div className="text-center text-lg">
            Loading profile...
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <UtilityNavbar />

      <MainNavbar />

      <OccasionBar />

      <main className="min-h-screen bg-rexo-ivory py-12">

        <Container>

          <div className="mx-auto max-w-5xl rounded-section bg-white p-10 shadow-card">

            <div className="mb-10">

              <h1 className="text-4xl font-black">
                Edit Profile
              </h1>

              <p className="mt-3 text-gray-500">
                Keep your personal information up to date.
              </p>

            </div>

            <div className="grid gap-8 md:grid-cols-2">

              <Input
                label="First Name"
                value={firstName}
                onChange={setFirstName}
              />

              <Input
                label="Last Name"
                value={lastName}
                onChange={setLastName}
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={setPhone}
              />

              <Input
                label="Date of Birth"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />

            </div>

            <div className="mt-12 flex flex-wrap gap-4">

              <Link
                href="/profile"
                className="rounded-full border border-gray-300 px-8 py-4 font-semibold transition hover:bg-gray-100"
              >
                Cancel
              </Link>

              <button
                onClick={saveProfile}
                className="rounded-full bg-rexo-teal px-8 py-4 font-semibold text-white transition hover:bg-rexo-teal-dark"
              >
                Save Changes
              </button>

            </div>

          </div>

        </Container>

      </main>
    </>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: InputProps) {
  return (
    <div>

      <label className="mb-2 block font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          rounded-input
          border
          border-gray-200
          bg-white
          p-4
          outline-none
          transition
          focus:border-rexo-teal
          focus:ring-2
          focus:ring-rexo-teal/20
        "
      />

    </div>
  );
}