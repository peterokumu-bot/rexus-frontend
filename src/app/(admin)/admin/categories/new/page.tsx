'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function NewCategoryPage() {

  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
  });

  async function submit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    try {

      await api.post(
        '/categories',
        form,
      );

      toast.success(
        'Category created successfully',
      );

      router.push(
        '/admin/categories',
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to create category',
      );

    }
  }

  return (

    <main className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Add Category
      </h1>

      <form
        onSubmit={submit}
        className="space-y-6"
      >

        <input
          placeholder="Category Name"
          className="w-full border p-4 rounded-xl"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Slug"
          className="w-full border p-4 rounded-xl"
          value={form.slug}
          onChange={(e) =>
            setForm({
              ...form,
              slug: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          rows={5}
          className="w-full border p-4 rounded-xl"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <input
          placeholder="Image URL"
          className="w-full border p-4 rounded-xl"
          value={form.imageUrl}
          onChange={(e) =>
            setForm({
              ...form,
              imageUrl: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Save Category
        </button>

      </form>

    </main>

  );
}