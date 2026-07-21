export interface ProductTag {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface Brand {
  id: string;
  name: string;
}

export interface Product {
  id: string;

  productNumber: string;

  sku: string;

  barcode?: string | null;

  name: string;

  slug: string;

  shortDescription?: string | null;

  description?: string | null;

  imageUrl?: string | null;

  price: number;

  discountPrice?: number | null;

  buyingPrice?: number;

  stock: number;

  reservedStock: number;

  lowStockAlert: number;

  isFeatured: boolean;

  isBestSeller: boolean;

  isNewArrival: boolean;

  isActive: boolean;

  freeShipping: boolean;

  estimatedDelivery?: string | null;

  allowGiftMessage: boolean;

  allowCustomText: boolean;

  allowPhotoUpload: boolean;

  averageRating?: number;

  reviewCount?: number;

  category?: ProductCategory | null;

  brand?: Brand | null;

  tags?: ProductTag[];
}