'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ProductModal from './ProductModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  async function loadProducts() {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProducts = products.length;

  const activeProducts = products.filter((p) => p.isActive).length;

  const lowStockProducts = products.filter(
    (p) => p.stock <= p.lowStockAlert,
  ).length;

  const featuredProducts = products.filter((p) => p.isFeatured).length;

  const filteredProducts = products.filter((product) => {

  const matchesSearch =
    !search ||
    product.name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    product.sku
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    !categoryFilter ||
    product.category?.name === categoryFilter;

  const matchesStatus =
    !statusFilter ||
    (statusFilter === 'active'
      ? product.isActive
      : !product.isActive);

  return (
    matchesSearch &&
    matchesCategory &&
    matchesStatus
  );

});

  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean)),
  );
  async function handleSaveProduct(form: any) {
  try {
    await api.post('/products', form);

    toast.success('Product created successfully');

    setShowModal(false);

    loadProducts();
  } catch (error: any) {
    console.error(error);

    /* FIX: surface the backend's actual validation/error message
       instead of a generic one, so the real cause is visible. */
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to create product';

    toast.error(message);
    throw error;
  }
}

  /* NEW: Duplicate a product by re-posting its data under a new name.
     Strips id/slug/sku so the backend can generate fresh, unique values
     for the copy instead of colliding with the original. */
  async function handleDuplicateProduct(product: any) {
    try {
      const { id, slug, sku, createdAt, updatedAt, ...rest } = product;

      const payload = {
        ...rest,
        name: `${product.name} (Copy)`,
      };

      await api.post('/products', payload);

      toast.success('Product duplicated successfully');

      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to duplicate product');
    }
  }

  /* NEW: Delete a product after explicit confirmation. */
  async function handleDeleteProduct(productId: string) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.',
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${productId}`);

      toast.success('Product deleted successfully');

      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage store products</p>
        </div>

<button
  onClick={() =>
    setShowModal(true)
  }
  className="
    bg-black
    text-white
    px-5
    py-3
    rounded-xl
  "
>
  + Add Product
</button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Total Products</p>
          <h2 className="text-4xl font-bold mt-2">{totalProducts}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Active Products</p>
          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {activeProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Low Stock</p>
          <h2 className="text-4xl font-bold text-red-600 mt-2">
            {lowStockProducts}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Featured Products</p>
          <h2 className="text-4xl font-bold text-purple-600 mt-2">
            {featuredProducts}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full
            border
            rounded-xl
            px-4
            py-3
            focus:outline-none
            focus:ring-2
            focus:ring-[#1b7979]
          "
        />
      </div>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="
          mt-4
          border
          rounded-xl
          px-4
          py-3
        "
      >
        <option value="">All Categories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
  value={statusFilter}
  onChange={(e) =>
    setStatusFilter(
      e.target.value,
    )
  }
  className="
    border
    rounded-xl
    px-4
    py-3
  "
>

  <option value="">
    All Status
  </option>

  <option value="active">
    Active
  </option>

  <option value="inactive">
    Inactive
  </option>

</select>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Marketing</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50"
                >
                  {/* IMAGE */}
                  <td className="p-4">
                    <img
                      src={product.imageUrl || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </td>

                  {/* PRODUCT */}
                  <td className="p-4">

  <div>

    <Link
      href={`/product/${product.slug}`}
      className="
        font-semibold
        text-[#1b7979]
        hover:underline
      "
    >
      {product.name}
    </Link>

    <div className="text-xs text-gray-500">
      {product.sku}
    </div>

  </div>

</td>

                  {/* CATEGORY */}
                  <td className="p-4">
                    <div>
                      <div>{product.category?.name || '-'}</div>
                      <div className="text-xs text-gray-500">
                        {product.subCategory?.name || '-'}
                      </div>
                    </div>
                  </td>

                  {/* PRICE */}
                  <td className="p-4">
                    KES {Number(product.price).toLocaleString()}
                  </td>

                  {/* STOCK */}
                  <td className="p-4">{product.stock}</td>

                  {/* STATUS */}
                  <td className="p-4">
                    <span
                      className={
                        product.isActive
                          ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm'
                          : 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm'
                      }
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* MARKETING */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isFeatured && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          Featured
                        </span>
                      )}

                      {product.isBestSeller && (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                          Bestseller
                        </span>
                      )}

                      {product.isNewArrival && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          New
                        </span>
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
<td className="p-4">

  <div className="flex gap-2">

    {/* FIX: was a dead button with no handler/href. Now links to the
        public product page, same pattern as the name Link above. */}
    <Link
      href={`/product/${product.slug}`}
      className="bg-gray-600 text-white px-3 py-1 rounded-lg"
    >
      View
    </Link>

    <Link
  href={`/admin/products/edit/${product.id}`}
  className="
    bg-blue-600
    text-white
    px-3
    py-1
    rounded-lg
  "
>
  Edit
</Link>

    {/* FIX: was a dead button with no handler. Now duplicates the
        product via handleDuplicateProduct. */}
    <button
      onClick={() => handleDuplicateProduct(product)}
      className="bg-green-600 text-white px-3 py-1 rounded-lg"
    >
      Duplicate
    </button>

    {/* FIX: was a dead button with no handler. Now confirms and
        deletes via handleDeleteProduct. */}
    <button
      onClick={() => handleDeleteProduct(product.id)}
      className="bg-red-600 text-white px-3 py-1 rounded-lg"
    >
      Delete
    </button>

  </div>

</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

<ProductModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onSave={handleSaveProduct}
/>

    </main>
  );
}