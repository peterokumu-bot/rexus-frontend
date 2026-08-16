'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
  normalizeName,
  isValidFullName,
  normalizeEmail,
  isValidEmail,
  sanitizePhoneInput,
  isValidPhone,
} from '@/common/utils';

export default function GuestCheckoutPage() {

  const router = useRouter();

  const [form, setForm] = useState({

    customerName: '',
    customerPhone: '',
    customerEmail: '',

    recipientName: '',
    recipientPhone: '',

    county: '',
    town: '',

    estate: '',
    building: '',
    landmark: '',

    deliveryInstructions: '',

  });

  const customerNameValid =
  isValidFullName(
    form.customerName,
  );

const recipientNameValid =
  isValidFullName(
    form.recipientName,
  );

const customerPhoneValid =
  isValidPhone(
    form.customerPhone,
  );

const recipientPhoneValid =
  isValidPhone(
    form.recipientPhone,
  );

const emailValid =
  isValidEmail(
    form.customerEmail,
  );

const requiredFields = [

  customerNameValid,
  customerPhoneValid,
  emailValid,


  form.county.trim(),
  form.town.trim(),

];

const completed =
  requiredFields.filter(Boolean)
    .length;

const progress =
  Math.round(
    (completed / 5) * 100,
  );

 
  async function continueToPayment() {

     if (!customerNameValid) {
  alert(
    'Please enter customer first and last name',
  );
  return;
}

if (!recipientNameValid) {
  alert(
    'Please enter recipient first and last name',
  );
  return;
}

if (!customerPhoneValid) {
  alert(
    'Invalid customer phone number',
  );
  return;
}

if (!recipientPhoneValid) {
  alert(
    'Invalid recipient phone number',
  );
  return;
}

if (!emailValid) {
  alert(
    'Invalid email address',
  );
  return;
}


  try {

    const guestCart =
      JSON.parse(
        localStorage.getItem(
          'guestCart',
        ) || '[]',
      );

    const response =
      await api.post(
        '/guest-checkout',
        {
          ...form,
          cartItems:
            guestCart,
        },
      );

    router.push(
      `/guest-payment?orderId=${response.data.order.id}`,
    );

  } catch (error) {

    console.error(error);

  }

}

  return (
  <>
    <main className="min-h-screen bg-gray-100 py-10 px-6">

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-10">

          <h1 className="text-4xl font-bold mb-8">
            Guest Checkout
          </h1>

          <div className="mb-8">

  <div className="flex justify-between mb-2">

    <span className="font-medium">
      Checkout Progress
    </span>

    <span>
      {progress}%
    </span>

  </div>

  <div className="h-3 bg-gray-200 rounded-full">

    <div
      className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
      style={{
        width: `${progress}%`,
      }}
    />

  </div>

</div>

          {/* CUSTOMER */}

          <h2 className="text-2xl font-semibold mb-4">
            Customer Information
          </h2>

          <div>


  <label className="block mb-2 font-medium">
    👤 Customer Name
  </label>

  <input
    placeholder="John Kamau"
    className={`w-full rounded-2xl p-4 border-2 transition ${
      form.customerName &&
      !customerNameValid
        ? 'border-red-400'
        : 'border-gray-200'
    }`}
    value={form.customerName}
    onChange={(e) =>
      setForm({
        ...form,
        customerName:
          e.target.value,
      })
    }
    onBlur={() =>
      setForm({
        ...form,
        customerName:
          normalizeName(
            form.customerName,
          ),
      })
    }
  />

  {form.customerName && (

    <p
      className={`text-sm mt-2 ${
        customerNameValid
          ? 'text-green-600'
          : 'text-red-500'
      }`}
    >
      {customerNameValid
        ? '✓ Looks good'
        : 'Enter first and last name'}
    </p>

  )}

</div>

{/* CUSTOMER PHONE */}
<div>


  <label className="block mb-2 font-medium">
    📱 Customer Phone
  </label>

  <input
    type="tel"
    maxLength={10}
    inputMode="numeric"
    placeholder="0701234567"
    className="w-full rounded-2xl p-4 border-2 border-gray-200"
    value={form.customerPhone}
    onChange={(e) =>
      setForm({
        ...form,
        customerPhone:
          sanitizePhoneInput(
            e.target.value,
          ),
      })
    }
  />

  <div className="flex justify-between mt-2">

    <p
      className={`text-sm ${
        customerPhoneValid
          ? 'text-green-600'
          : 'text-gray-400'
      }`}
    >
      {customerPhoneValid
        ? '✓ Valid number'
        : '10 digits required'}
    </p>

    <p className="text-xs text-gray-400">
      {
        form.customerPhone
          .length
      }/10
    </p>

  </div>

</div>

{/* CUSTOMER EMAIL */}
<div>

  <label className="block mb-2 font-medium">
    ✉️ Email Address
  </label>

  <input
    type="email"
    placeholder="john@gmail.com"
    className="w-full rounded-2xl p-4 border-2 border-gray-200"
    value={form.customerEmail}
    onChange={(e) =>
      setForm({
        ...form,
        customerEmail:
          normalizeEmail(
            e.target.value,
          ),
      })
    }
  />

  {form.customerEmail && (

    <p
      className={`text-sm mt-2 ${
        emailValid
          ? 'text-green-600'
          : 'text-red-500'
      }`}
    >
      {emailValid
        ? '✓ Valid email'
        : 'Invalid email'}
    </p>

  )}

</div>

          {/* RECIPIENT */}

          <h2 className="text-2xl font-semibold mb-4">
            Recipient Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-8">

            <input
              placeholder="Recipient Name"
              className="border rounded-xl p-4"
              value={form.recipientName}
              onChange={(e) =>
                setForm({
                  ...form,
                  recipientName: e.target.value,
                })
              }
            />

            <input
              placeholder="Recipient Phone"
              className="border rounded-xl p-4"
              value={form.recipientPhone}
              onChange={(e) =>
                setForm({
                  ...form,
                  recipientPhone: e.target.value,
                })
              }
            />

          </div>

          {/* DELIVERY */}

          <h2 className="text-2xl font-semibold mb-4">
            Delivery Address
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
  placeholder="County"
  className="border rounded-xl p-4"
  value={form.county}
  onChange={(e) =>
    setForm({
      ...form,
      county: e.target.value,
    })
  }
/>

            <input
              placeholder="Town"
              className="border rounded-xl p-4"
              value={form.town}
              onChange={(e) =>
                setForm({
                  ...form,
                  town: e.target.value,
                })
              }
            />

            <input
              placeholder="Estate"
              className="border rounded-xl p-4"
              value={form.estate}
              onChange={(e) =>
                setForm({
                  ...form,
                  estate: e.target.value,
                })
              }
            />

            <input
              placeholder="Building"
              className="border rounded-xl p-4"
              value={form.building}
              onChange={(e) =>
                setForm({
                  ...form,
                  building: e.target.value,
                })
              }
            />

            <input
              placeholder="Landmark"
              className="border rounded-xl p-4"
              value={form.landmark}
              onChange={(e) =>
                setForm({
                  ...form,
                  landmark: e.target.value,
                })
              }
            />

          </div>

          <textarea
            placeholder="Delivery Instructions"
            className="border rounded-xl p-4 w-full mt-4"
            rows={4}
            value={form.deliveryInstructions}
            onChange={(e) =>
              setForm({
                ...form,
                deliveryInstructions: e.target.value,
              })
            }
          />

          <button
  onClick={continueToPayment}
  disabled={progress < 100}
  className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.01] transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  Continue To Payment →
</button>

        </div>
      </main>
  </>
);
}