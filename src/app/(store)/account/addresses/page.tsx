'use client';

import { useEffect, useState }
from 'react';

import api
from '@/lib/api';

import toast
from 'react-hot-toast';

export default function AddressesPage() {

  const [addresses, setAddresses] =
    useState([]);

  const [fullName, setFullName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [county, setCounty] =
    useState('');

  const [town, setTown] =
    useState('');

  const [estate, setEstate] =
    useState('');

  const [building, setBuilding] =
    useState('');

  const [landmark, setLandmark] =
    useState('');

  const [
    deliveryInstructions,

    setDeliveryInstructions,
  ] = useState('');

  const [isDefault, setIsDefault] =
    useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {

    try {

      const token =
        localStorage.getItem('token');

      const response =
        await api.get('/addresses', {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

      setAddresses(response.data);

    } catch (error) {

      console.error(error);
    }
  }

  async function createAddress() {

    try {

      const token =
        localStorage.getItem('token');

      await api.post(
        '/addresses',

        {
          fullName,
          phone,
          county,
          town,
          estate,
          building,
          landmark,
          deliveryInstructions,
          isDefault,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      );

      toast.success(
        'Address saved 🚚',
      );

      setFullName('');
      setPhone('');
      setCounty('');
      setTown('');
      setEstate('');
      setBuilding('');
      setLandmark('');
      setDeliveryInstructions('');
      setIsDefault(false);

      fetchAddresses();

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to save address',
      );
    }
  }

    return (
    <>
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-10 text-white shadow-xl mb-10">
            <h1 className="text-5xl font-bold mb-3">
              Saved Addresses
            </h1>
            <p className="text-lg opacity-90">
              Manage delivery locations.
            </p>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-10">
            <h2 className="text-3xl font-bold mb-8">
              Add Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="p-4 rounded-2xl border"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="p-4 rounded-2xl border"
              />

              <input
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="County"
                className="p-4 rounded-2xl border"
              />

              <input
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="Town"
                className="p-4 rounded-2xl border"
              />

              <input
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                placeholder="Estate"
                className="p-4 rounded-2xl border"
              />

              <input
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Building"
                className="p-4 rounded-2xl border"
              />

              <input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Landmark"
                className="p-4 rounded-2xl border"
              />
            </div>

            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="Delivery Instructions"
              className="w-full mt-6 p-4 rounded-2xl border h-32"
            />

            <div className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <p>Set as default address</p>
            </div>

            <button
              onClick={createAddress}
              className="mt-6 bg-black text-white px-8 py-4 rounded-full hover:scale-105 transition"
            >
              Save Address
            </button>
          </div>

          {/* ADDRESSES LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address: any) => (
              <div
                key={address.id}
                className="bg-white rounded-3xl p-8 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">
                    {address.fullName}
                  </h2>

                  {address.isDefault && (
                    <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                      Default
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-2">{address.phone}</p>
                <p className="text-gray-600 mb-2">
                  {address.county}, {address.town}
                </p>

                {address.estate && (
                  <p className="text-gray-600 mb-2">
                    Estate: {address.estate}
                  </p>
                )}

                {address.building && (
                  <p className="text-gray-600 mb-2">
                    Building: {address.building}
                  </p>
                )}

                {address.landmark && (
                  <p className="text-gray-600 mb-2">
                    Landmark: {address.landmark}
                  </p>
                )}

                {address.deliveryInstructions && (
                  <p className="text-gray-500 mt-4">
                    {address.deliveryInstructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}