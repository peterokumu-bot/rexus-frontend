'use client';

import { useEffect, useState }
from 'react';
import AppLayout from '@/components/layout/AppLayout';
import api
from '@/lib/api';

import toast
from 'react-hot-toast';


export default function RecipientsPage() {

  const [recipients, setRecipients] =
    useState([]);

    const [upcoming, setUpcoming] =
  useState([]);

  const [name, setName] =
    useState('');

  const [relationship,
    setRelationship] =
    useState('');

  const [occasion,
    setOccasion] =
    useState('');

  const [birthday,
    setBirthday] =
    useState('');

  const [notes,
    setNotes] =
    useState('');

  useEffect(() => {
    fetchRecipients();
    fetchUpcoming();
  }, []);

  async function fetchRecipients() {

    try {

      const token =
        localStorage.getItem('token');

      const response =
        await api.get('/recipients', {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

      setRecipients(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  async function fetchUpcoming() {

  try {

    const token =
      localStorage.getItem('token');

    const response =
      await api.get(
        '/recipients/upcoming',
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

    setUpcoming(response.data);

  } catch (error) {
    console.error(error);
  }
}

  async function createRecipient() {

    try {

      const token =
        localStorage.getItem('token');

      await api.post(
        '/recipients',

        {
          name,
          relationship,
          occasion,
          birthday,
          notes,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      toast.success(
        'Recipient added ❤️',
      );

      setName('');
      setRelationship('');
      setOccasion('');
      setBirthday('');
      setNotes('');

      fetchRecipients();

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to add recipient',
      );
    }
  }

  return (

   <AppLayout>

      <main className="min-h-screen bg-gray-100 p-8">

        <div className="max-w-6xl mx-auto">

          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-10 text-white shadow-xl mb-10">

            <h1 className="text-5xl font-bold mb-3">
              Gift Recipients
            </h1>

            <p className="text-lg opacity-90">
              Save loved ones and
              special occasions.
            </p>

          </div>

          {/* UPCOMING OCCASIONS */}

<div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

  <h2 className="text-3xl font-bold mb-8">
    Upcoming Occasions
  </h2>

  <div className="space-y-4">

    {upcoming.map((person: any) => (

      <div
        key={person.id}
        className="bg-pink-50 border border-pink-200 rounded-2xl p-6"
      >

        <h3 className="text-2xl font-bold mb-2">

          🎂 {person.name}

        </h3>

        <p className="text-gray-600">

          {person.relationship}

        </p>

        <p className="text-pink-600 font-semibold mt-2">

          Birthday:
          {' '}

          {new Date(
            person.birthday,
          ).toLocaleDateString()}

        </p>

      </div>
    ))}

  </div>

</div>

          {/* FORM */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-10">

            <h2 className="text-3xl font-bold mb-8">
              Add Recipient
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Recipient Name"
                className="p-4 rounded-2xl border"
              />

              <input
                value={relationship}
                onChange={(e) =>
                  setRelationship(
                    e.target.value,
                  )
                }
                placeholder="Relationship"
                className="p-4 rounded-2xl border"
              />

              <input
                value={occasion}
                onChange={(e) =>
                  setOccasion(
                    e.target.value,
                  )
                }
                placeholder="Occasion"
                className="p-4 rounded-2xl border"
              />

              <input
                type="date"
                value={birthday}
                onChange={(e) =>
                  setBirthday(
                    e.target.value,
                  )
                }
                className="p-4 rounded-2xl border"
              />

            </div>

            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Notes"
              className="w-full mt-6 p-4 rounded-2xl border h-32"
            />

            <button
              onClick={createRecipient}
              className="mt-6 bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition"
            >
              Save Recipient
            </button>

          </div>

          {/* RECIPIENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {recipients.map((recipient: any) => (

              <div
                key={recipient.id}
                className="bg-white rounded-3xl p-8 shadow-lg"
              >

                <h2 className="text-3xl font-bold mb-3">
                  {recipient.name}
                </h2>

                <p className="text-gray-600 mb-2">
                  Relationship:
                  {' '}
                  {recipient.relationship}
                </p>

                <p className="text-gray-600 mb-2">
                  Occasion:
                  {' '}
                  {recipient.occasion}
                </p>

                {recipient.birthday && (

                  <p className="text-gray-600 mb-2">

                    Birthday:
                    {' '}

                    {new Date(
                      recipient.birthday,
                    ).toLocaleDateString()}
                  </p>
                )}

                {recipient.notes && (

                  <p className="text-gray-500 mt-4">
                    {recipient.notes}
                  </p>
                )}

              </div>
            ))}

          </div>

        </div>

      </main>
  </AppLayout>
  );
}