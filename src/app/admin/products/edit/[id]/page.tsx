'use client';

import { use, useEffect, useState } from 'react';
import api from '@/lib/api';

export default function EditProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

const [loading, setLoading] = useState(true);

const [product, setProduct] = useState<any>(null);

  const { id } = use(params);

  useEffect(() => {

  loadProduct();

}, []);

async function loadProduct() {

  try {

    const response =
      await api.get(
        `/products/${id}`,
      );

    setProduct(
      response.data,
    );

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}

if (loading) {

  return (

    <div className="p-10">

      Loading Product...

    </div>

  );

}

if (!product) {

  return (

    <div className="p-10">

      Product Not Found

    </div>

  );

}

async function saveProduct() {

  try {

    await api.patch(

      `/products/${id}`,

      {

        name: product.name,

        price: product.price,

        stock: product.stock,

      },

    );

    alert(
      'Product updated successfully',
    );

  } catch (error) {

    console.error(error);

    alert(
      'Failed to update product',
    );

  }

}

return (

  <main className="max-w-4xl mx-auto p-8">

    <h1 className="text-4xl font-bold mb-8">

      Edit Product

    </h1>

    <div className="bg-white rounded-2xl shadow p-6 space-y-6">

  <div>

    <label className="block mb-2 font-semibold">
      Product Name
    </label>

    <input
      value={product.name || ''}
      onChange={(e) =>
        setProduct({
          ...product,
          name: e.target.value,
        })
      }
      className="
        w-full
        border
        rounded-xl
        p-3
      "
    />

  </div>

  <div>

    <label className="block mb-2 font-semibold">
      Price
    </label>

    <input
      type="number"
      value={product.price || 0}
      onChange={(e) =>
        setProduct({
          ...product,
          price: Number(
            e.target.value,
          ),
        })
      }
      className="
        w-full
        border
        rounded-xl
        p-3
      "
    />

  </div>

  <div>

    <label className="block mb-2 font-semibold">
      Stock
    </label>

    <input
      type="number"
      value={product.stock || 0}
      onChange={(e) =>
        setProduct({
          ...product,
          stock: Number(
            e.target.value,
          ),
        })
      }
      className="
        w-full
        border
        rounded-xl
        p-3
      "
    />

  </div>

  <div className="pt-4">

  <button

    onClick={saveProduct}

    className="
      bg-[#1b7979]
      text-white
      px-6
      py-3
      rounded-xl
      font-semibold
    "

  >
    Save Changes
  </button>

</div>

</div>

  </main>

);
}