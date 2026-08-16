'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function EditCategoryPage() {

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
  });

  async function loadCategory() {

    try {

      const response =
        await api.get(
          `/categories/${params.id}`,
        );

      setForm({
        name:
          response.data.name || '',
        slug:
          response.data.slug || '',
        description:
          response.data.description || '',
        imageUrl:
          response.data.imageUrl || '',
      });

    } catch (error) {

      console.error(error);

      toast.error(
        'Failed to load category',
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    loadCategory();
  }, []);

  async function submit(
    e: React.FormEvent,
  ) {

    e.preventDefault();

    try {

      await api.patch(
        `/categories/${params.id}`,
        form,
      );

      toast.success(
        'Category updated',
      );

      router.push(
        '/admin/categories',
      );

    } catch (error) {

      console.error(error);

      toast.error(
        'Update failed',
      );

    }
  }

  if (loading) {
    return (
      <div className="p-8">
        Loading...
      </div>
    );
  }

  return (

    <main className="max-w-3xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">
        Edit Category
      </h1>

      <form
        onSubmit={submit}
        className="space-y-6"
      >

        <input
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
          rows={5}
          className="w-full border p-4 rounded-xl"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <input
          className="w-full border p-4 rounded-xl"
          value={form.imageUrl}
          onChange={(e) =>
            setForm({
              ...form,
              imageUrl:
                e.target.value,
            })
          }
        />

        <button
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Update Category
        </button>

      </form>

    </main>

  );
}