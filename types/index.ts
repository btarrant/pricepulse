export type PriceHistoryItem = {
  price: number;
};

export type User = {
  email: string;
};

export interface Product {
  _id: string;
  url: string;
  currency: string;
  image: string;
  title?: string;
  currentPrice: number;
  originalPrice: number;
  priceHistory: { price: number; date: string }[];
  lowestPrice?: number;
  highestPrice?: number;
  averagePrice?: number;
  discountRate?: number;
  description?: string;
  category?: string;
  reviewsCount?: number;
  stars?: number;
  isOutOfStock?: boolean;
  users?: { email: string }[];
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationType = "WELCOME" | "CHANGE_OF_STOCK" | "LOWEST_PRICE" | "THRESHOLD_MET";

export type EmailContent = {
  subject: string;
  body: string;
};

export type EmailProductInfo = {
  title: string;
  url: string;
};
