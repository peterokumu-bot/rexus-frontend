'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowLeft,
  ChevronRight,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Gift,
  Sparkles,
  Shield,
  MessageSquare,
} from 'lucide-react';

import { useParams, useRouter } from 'next/navigation';

import Container from '@/components/layout/Container';
import CatalogItem from '@/components/catalog/CatalogItem';

import api from '@/lib/api';

/* =====================================================
    HELPER COMPONENTS
===================================================== */

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

interface SpecificationProps {
  label: string;
  value: string;
}

function Specification({ label, value }: SpecificationProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-6 py-5">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

interface ReviewCardProps {
  name: string;
  rating: number;
  date: string;
  review: string;
}

function ReviewCard({ name, rating, date, review }: ReviewCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              className={
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }
            />
          ))}
        </div>
      </div>
      <p className="mt-5 leading-8 text-gray-600">{review}</p>
    </div>
  );
}

interface TrustCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TrustCard({ icon, title, description }: TrustCardProps) {
  return (
    <div className="rounded-3xl bg-white/10 p-7 backdrop-blur">
      <div className="mb-5">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/80">{description}</p>
    </div>
  );
}

/* =====================================================
    PAGE
===================================================== */

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  async function fetchProduct() {
    try {
      setLoading(true);

      const response = await api.get(`/products/slug/${slug}`);

      setProduct(response.data);
      setSelectedImage(response.data.imageUrl);

      const products = await api.get('/products');

      const filtered = products.data.filter(
        (p: any) => p.id !== response.data.id,
      );

      setRelatedProducts(filtered.slice(0, 7));
      setRecentProducts(filtered.slice(7, 14));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
      LOADING
  ===================================================== */

  if (loading) {
    return (
      <Container>
        <div className="flex h-[70vh] items-center justify-center">
          <p className="text-xl">Loading Product...</p>
        </div>
      </Container>
    );
  }

  /* =====================================================
      NOT FOUND
  ===================================================== */

  if (!product) {
    return (
      <Container>
        <div className="flex h-[70vh] flex-col items-center justify-center">
          <h2 className="text-4xl font-black">Product Not Found</h2>
          <button
            onClick={() => router.push('/products')}
            className="mt-8 rounded-full bg-rexo-primary px-8 py-3 font-semibold text-white"
          >
            Continue Shopping
          </button>
        </div>
      </Container>
    );
  }

  /* =====================================================
      PAGE
  ===================================================== */

  return (
    <>
      <Container className="max-w-[1700px]">
        <main className="py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/">Home</Link>
            <ChevronRight size={16} />
            <Link href="/products">Products</Link>
            <ChevronRight size={16} />
            <span className="font-semibold text-black">{product.name}</span>
          </div>

          {/* Back */}
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition hover:border-rexo-primary hover:text-rexo-primary"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {/* HERO */}
          <section className="grid items-start gap-10 lg:grid-cols-[52%_48%]">
            {/* PRODUCT GALLERY + ACTIONS */}
            <section>
              <div className="flex flex-col gap-5 lg:flex-row">
                {/* Thumbnails */}
                <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:w-24 lg:flex-col">
                  {(product.images?.length
                    ? product.images
                    : [product.imageUrl]
                  ).map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                        selectedImage === image
                          ? 'border-rexo-primary'
                          : 'border-gray-200 hover:border-rexo-primary'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={product.name}
                        width={90}
                        height={90}
                        className="h-20 w-20 object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* MAIN IMAGE */}
                <div
                  className="relative flex-1 overflow-hidden rounded-[30px] bg-gradient-to-br from-white via-[#FAFAF8] to-[#F6F6F6]"
                  onMouseEnter={() => setImageZoom(true)}
                  onMouseLeave={() => setImageZoom(false)}
                  onMouseMove={(e) => {
                    const bounds = e.currentTarget.getBoundingClientRect();
                    setZoomPosition({
                      x: ((e.clientX - bounds.left) / bounds.width) * 100,
                      y: ((e.clientY - bounds.top) / bounds.height) * 100,
                    });
                  }}
                >
                  <Image
                    src={selectedImage || product.imageUrl}
                    alt={product.name}
                    width={900}
                    height={900}
                    priority
                    draggable={false}
                    className="mx-auto h-[560px] w-full object-contain transition-transform duration-300"
                  />

                  {/* MAGNIFIER */}
                  {imageZoom && (
                    <div
                      className="pointer-events-none absolute right-5 top-5 h-52 w-52 overflow-hidden rounded-full border-4 border-white shadow-2xl"
                      style={{
                        backgroundImage: `url(${selectedImage || product.imageUrl})`,
                        backgroundSize: '220%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                    />
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-5 flex items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition hover:border-rexo-primary hover:text-rexo-primary">
                  <Heart size={18} />
                  Save
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition hover:border-rexo-primary hover:text-rexo-primary">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </section>

            {/* PRODUCT INFORMATION */}
            <section>
              <div className="space-y-6">
                {/* CATEGORY */}
                <span className="inline-flex rounded-full bg-rexo-primary/10 px-4 py-2 text-sm font-semibold text-rexo-primary">
                  {product.category?.name || 'General'}
                </span>

                {/* PRODUCT NAME */}
                <h1 className="text-4xl font-black leading-tight">
                  {product.name}
                </h1>

                {/* RATING */}
                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold">
                    {product.averageRating || '4.8'}
                  </span>
                  <span className="text-gray-500">
                    ({product.reviewCount || 0} Reviews)
                  </span>
                </div>

                {/* PRICE */}
                <div>
                  <div className="flex items-end gap-4">
                    <h2 className="text-3xl font-black text-rexo-primary">
                      KES {Number(product.price).toLocaleString()}
                    </h2>
                    {product.discountPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        KES {Number(product.discountPrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* SHORT DESCRIPTION */}
                <p className="leading-8 text-gray-600">
                  {product.description}
                </p>

                {/* PRODUCT DETAILS */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-5 rounded-3xl border border-gray-200 p-6">
                  <InfoRow
                    label="Brand"
                    value={product.brand?.name || 'Rexo'}
                  />
                  <InfoRow
                    label="Category"
                    value={product.category?.name || 'General'}
                  />
                  <InfoRow label="SKU" value={product.sku || 'N/A'} />
                  <InfoRow label="Stock" value={`${product.stock}`} />
                </div>

                {/* QUANTITY */}
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Quantity
                  </p>
                  <div className="flex w-fit items-center rounded-2xl border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 transition hover:bg-gray-100"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="min-w-[60px] text-center text-lg font-bold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 transition hover:bg-gray-100"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* ADD TO CART */}
                <button className="inline-flex items-center gap-3 rounded-full bg-rexo-primary px-8 py-3 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-rexo-primary-dark">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>

                {/* SAVE & SHARE */}
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition hover:border-rexo-primary hover:text-rexo-primary">
                    <Heart size={18} />
                    Save
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm transition hover:border-rexo-primary hover:text-rexo-primary">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            </section>
          </section>

          {/* GIFT EXPERIENCE */}
          <section className="mt-20">
            <section className="mt-16">
              <div className="mb-8">
                <h2 className="text-3xl font-black">Gift Experience</h2>
                <p className="mt-2 text-gray-500">
                  Personalize your gift with premium finishing touches.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {/* Gift Wrap */}
                <label className="group cursor-pointer rounded-3xl border border-gray-200 p-6 transition-all hover:border-rexo-primary hover:shadow-lg">
                  <input type="checkbox" className="hidden" />
                  <Gift size={30} className="mb-4 text-rexo-primary" />
                  <h3 className="font-bold">Premium Gift Wrap</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Elegant wrapping with luxury ribbon.
                  </p>
                  <span className="mt-5 inline-block rounded-full bg-rexo-primary/10 px-3 py-1 text-xs font-semibold text-rexo-primary">
                    +KES 250
                  </span>
                </label>

                {/* Greeting Card */}
                <label className="group cursor-pointer rounded-3xl border border-gray-200 p-6 transition-all hover:border-rexo-primary hover:shadow-lg">
                  <input type="checkbox" className="hidden" />
                  <MessageSquare
                    size={30}
                    className="mb-4 text-rexo-primary"
                  />
                  <h3 className="font-bold">Greeting Card</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Include a beautifully printed message card.
                  </p>
                  <span className="mt-5 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    FREE
                  </span>
                </label>

                {/* Luxury Packaging */}
                <label className="group cursor-pointer rounded-3xl border border-gray-200 p-6 transition-all hover:border-rexo-primary hover:shadow-lg">
                  <input type="checkbox" className="hidden" />
                  <Sparkles size={30} className="mb-4 text-rexo-primary" />
                  <h3 className="font-bold">Luxury Packaging</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Premium presentation with exclusive packaging.
                  </p>
                  <span className="mt-5 inline-block rounded-full bg-rexo-primary/10 px-3 py-1 text-xs font-semibold text-rexo-primary">
                    +KES 150
                  </span>
                </label>

                {/* Product Protection */}
                <label className="group cursor-pointer rounded-3xl border border-gray-200 p-6 transition-all hover:border-rexo-primary hover:shadow-lg">
                  <input type="checkbox" className="hidden" />
                  <Shield size={30} className="mb-4 text-rexo-primary" />
                  <h3 className="font-bold">Delivery Protection</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Extra protection during transportation.
                  </p>
                  <span className="mt-5 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Included
                  </span>
                </label>
              </div>
            </section>
          </section>

          {/* PRODUCT DETAILS */}
          <section className="mt-20">
            <section className="mt-20 space-y-20">
              {/* DESCRIPTION */}
              <div>
                <h2 className="mb-6 text-3xl font-black">
                  Product Description
                </h2>
                <div className="max-w-5xl">
                  <p className="leading-9 text-gray-600">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* SPECIFICATIONS */}
              <div>
                <h2 className="mb-8 text-3xl font-black">Specifications</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <Specification
                    label="Brand"
                    value={product.brand?.name || 'Rexo'}
                  />
                  <Specification
                    label="Category"
                    value={product.category?.name || 'General'}
                  />
                  <Specification label="SKU" value={product.sku || 'N/A'} />
                  <Specification
                    label="Barcode"
                    value={product.barcode || 'N/A'}
                  />
                  <Specification label="Stock" value={`${product.stock}`} />
                  <Specification
                    label="Availability"
                    value={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  />
                </div>
              </div>

              {/* REVIEWS */}
              <div>
                <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black">Customer Reviews</h2>
                    <p className="mt-2 text-gray-500">
                      Hear what our customers say.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-rexo-primary">
                      {product.averageRating || '4.8'}
                    </div>
                    <div className="mt-2 flex justify-end">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <ReviewCard
                    name="Peter O."
                    rating={5}
                    date="2 days ago"
                    review="Amazing quality. Delivery was fast and the packaging exceeded my expectations."
                  />
                  <ReviewCard
                    name="Grace W."
                    rating={5}
                    date="Last week"
                    review="Exactly as shown on the website. Beautiful presentation and excellent customer service."
                  />
                  <ReviewCard
                    name="Kevin M."
                    rating={4}
                    date="2 weeks ago"
                    review="Very satisfied with the purchase. I will definitely shop at Rexo again."
                  />
                </div>
              </div>
            </section>
          </section>

          {/* YOU MAY ALSO LIKE / RECENTLY VIEWED / WHY SHOP WITH REXO */}
          <section className="mt-20">
            <section className="mt-24">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black">You May Also Like</h2>
                  <p className="mt-2 text-gray-500">
                    Products similar to this one.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="rounded-full border border-rexo-primary px-5 py-2 text-sm font-semibold text-rexo-primary transition hover:bg-rexo-primary hover:text-white"
                >
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {relatedProducts.map((item: any) => (
                  <CatalogItem key={item.id} product={item} />
                ))}
              </div>
            </section>

            <section className="mt-24">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black">Recently Viewed</h2>
                  <p className="mt-2 text-gray-500">
                    Continue where you left off.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                {recentProducts.map((item: any) => (
                  <CatalogItem key={item.id} product={item} />
                ))}
              </div>
            </section>

            <section className="mt-24 rounded-[36px] bg-gradient-to-r from-rexo-primary to-rexo-primary-dark p-10 text-white">
              <div className="mb-10 text-center">
                <h2 className="text-4xl font-black">Why Shop With Rexo</h2>
                <p className="mt-3 text-white/80">
                  We make gifting simple, memorable and reliable.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                <TrustCard
                  icon={<Gift size={34} />}
                  title="Premium Gifts"
                  description="Carefully selected quality gifts for every occasion."
                />
                <TrustCard
                  icon={<Shield size={34} />}
                  title="Secure Payments"
                  description="Pay safely using M-Pesa, Cards or Bank Transfer."
                />
                <TrustCard
                  icon={<Sparkles size={34} />}
                  title="Luxury Packaging"
                  description="Every order receives premium presentation."
                />
                <TrustCard
                  icon={<ShoppingCart size={34} />}
                  title="Fast Delivery"
                  description="Reliable nationwide delivery with live tracking."
                />
              </div>
            </section>
          </section>
        </main>
      </Container>
    </>
  );
}