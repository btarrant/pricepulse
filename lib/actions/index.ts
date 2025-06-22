"use server";

import { revalidatePath } from "next/cache";
import ProductModel from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeProductByUrl, ScrapedProduct } from "../scrapers/amazon-legacy";
import {
  getAveragePrice,
  getHighestPrice,
  getLowestPrice,
} from "../utils";
import { Product, User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDB();

    const scrapedProduct = await scrapeProductByUrl(productUrl);
    if (!scrapedProduct) return;

    let product: ScrapedProduct = scrapedProduct;

    const existingProduct = await ProductModel.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: { price: number; date: string }[] = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice, date: new Date().toISOString() },
      ];

      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }

    const newProduct = await ProductModel.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    if (!newProduct) return null;

    revalidatePath(`/products/${newProduct._id}`);

    return {
      ...(newProduct.toObject() as Omit<Product, "_id">),
      _id: newProduct._id.toString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    await connectToDB();

    const product = await ProductModel.findById(productId).lean() as unknown as Product;
    if (!product) return null;

    return {
      _id: product._id.toString(),
      url: product.url,
      currency: product.currency ?? "$",
      image: product.image,
      title: product.title,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice ?? product.currentPrice,
      priceHistory: product.priceHistory ?? [],
      discountRate: product.discountRate ?? 0,
      category: product.category ?? "Uncategorized",
      reviewsCount: product.reviewsCount ?? 0,
      stars: product.stars ?? 0,
      isOutOfStock: product.isOutOfStock ?? false,
      description: product.description ?? "",
      lowestPrice: product.lowestPrice ?? product.currentPrice,
      highestPrice: product.highestPrice ?? product.currentPrice,
      averagePrice: product.averagePrice ?? product.currentPrice,
      users: product.users ?? [],
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    await connectToDB();

    const products = await ProductModel.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return products.map((product) => {
      const p = product as unknown as Product;
      return {
        _id: p._id.toString(),
        url: p.url,
        currency: p.currency ?? "$",
        image: p.image,
        title: p.title,
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice ?? p.currentPrice,
        priceHistory: p.priceHistory ?? [],
        discountRate: p.discountRate ?? 0,
        category: p.category ?? "Uncategorized",
        reviewsCount: p.reviewsCount ?? 0,
        stars: p.stars ?? 0,
        isOutOfStock: p.isOutOfStock ?? false,
        description: p.description ?? "",
        lowestPrice: p.lowestPrice ?? p.currentPrice,
        highestPrice: p.highestPrice ?? p.currentPrice,
        averagePrice: p.averagePrice ?? p.currentPrice,
        users: p.users ?? [],
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSimilarProducts(productId: string): Promise<Product[] | null> {
  try {
    await connectToDB();

    const currentProduct = await ProductModel.findById(productId).lean();
    if (!currentProduct) return null;

    const similarProducts = await ProductModel.find({ _id: { $ne: productId } })
      .limit(3)
      .lean();

    return similarProducts.map((product) => {
      const p = product as unknown as Product;
      return {
        _id: p._id.toString(),
        url: p.url,
        currency: p.currency ?? "$",
        image: p.image,
        title: p.title,
        currentPrice: p.currentPrice,
        originalPrice: p.originalPrice ?? p.currentPrice,
        priceHistory: p.priceHistory ?? [],
        discountRate: p.discountRate ?? 0,
        category: p.category ?? "Uncategorized",
        reviewsCount: p.reviewsCount ?? 0,
        stars: p.stars ?? 0,
        isOutOfStock: p.isOutOfStock ?? false,
        description: p.description ?? "",
        lowestPrice: p.lowestPrice ?? p.currentPrice,
        highestPrice: p.highestPrice ?? p.currentPrice,
        averagePrice: p.averagePrice ?? p.currentPrice,
        users: p.users ?? [],
      };
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    await connectToDB();

    const product = await ProductModel.findById(productId);
    if (!product) return;

    const userExists = product.users.some((user: User) => user.email === userEmail);
    if (!userExists) {
      product.users.push({ email: userEmail });

      await product.save();

      const emailContent = await generateEmailBody(product, "WELCOME");
      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
