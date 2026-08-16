'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CategoriesPage() {

const [categories, setCategories] =
useState<any[]>([]);

const [loading, setLoading] =
useState(true);

async function loadCategories() {

try {

  const response =
    await api.get('/categories');

  setCategories(
    response.data,
  );

} catch (error) {

  console.error(error);

  toast.error(
    'Failed to load categories',
  );

} finally {

  setLoading(false);

}

}

async function deleteCategory(
id: string,
) {

const confirmed =
  confirm(
    'Delete this category?',
  );

if (!confirmed) {
  return;
}

try {

  await api.delete(
    `/categories/${id}`,
  );

  toast.success(
    'Category deleted',
  );

  loadCategories();

} catch (error) {

  console.error(error);

  toast.error(
    'Delete failed',
  );

}


}

useEffect(() => {
loadCategories();
}, []);

return (

<main className="p-8">

  <div className="flex justify-between items-center mb-8">

    <div>

      <h1 className="text-3xl font-bold">
        Categories
      </h1>

      <p className="text-gray-500">
        Manage product categories
      </p>

    </div>

    <Link
      href="/admin/categories/new"
      className="bg-black text-white px-5 py-3 rounded-xl"
    >
      + Add Category
    </Link>

  </div>

  <div className="bg-white rounded-2xl shadow overflow-hidden">

    <table className="w-full">

      <thead>

        <tr className="border-b">

          <th className="p-4 text-left">
            Image
          </th>

          <th className="p-4 text-left">
            Name
          </th>

          <th className="p-4 text-left">
            Slug
          </th>

          <th className="p-4 text-left">
            Actions
          </th>

        </tr>

      </thead>

      <tbody>

        {loading ? (

          <tr>

            <td
              colSpan={4}
              className="p-6 text-center"
            >
              Loading...
            </td>

          </tr>

        ) : (

          categories.map(
            (category) => (

              <tr
                key={category.id}
                className="border-b"
              >

                <td className="p-4">

                  <img
                    src={
                      category.imageUrl ||
                      '/placeholder.jpg'
                    }
                    alt={category.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                </td>

                <td className="p-4">
                  {category.name}
                </td>

                <td className="p-4">
                  {category.slug}
                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        deleteCategory(
                          category.id,
                        )
                      }
                      className="px-3 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ),
          )

        )}

      </tbody>

    </table>

  </div>

</main>

);
}
