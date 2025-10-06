export const LIMIT = 20;

export type DimensionsTypes = {
  width: number;
  height: number;
  depth: number;
};

export type ReviewsTypes = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type MetaTypes = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

export type ProductTypes = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: DimensionsTypes;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ReviewsTypes[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: MetaTypes;
  images: string[];
  thumbnail: string;
};

export type ApiResponseTypes = {
  products: any[];
  total: number;
  skip: number;
  limit: number;
};
