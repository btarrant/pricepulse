"use server";

import { revalidatePath } from "next/cache";
import ProductModel from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { Product, User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    await connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);
    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await ProductModel.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
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
    ).lean();

    if (!newProduct) return null;

    revalidatePath(`/products/${newProduct._id}`);

    return {
      ...newProduct,
      _id: newProduct._id.toString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    await connectToDB();

    const product = await ProductModel.findById(productId).lean();

    if (!product) return null;

    return {
      ...(product as Omit<Product, "_id">),
      _id: product._id.toString(),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}


type LeanProduct = {
  _id: any;
  name: string;
  price?: string;
  currentPrice?: string;
  image: string;
  url: string;
};

export async function getAllProducts(): Promise<LeanProduct[]> {
  try {
    await connectToDB();

    const products = (await ProductModel.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()) as LeanProduct[];

    return products.map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));
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

    return similarProducts.map((product) => ({
      ...product,
      _id: product._id.toString(),
    })) as Product[];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
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
