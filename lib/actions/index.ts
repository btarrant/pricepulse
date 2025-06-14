"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    let product = scrapedProduct;

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

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

    const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, {
      upsert: true,
      new: true,
    }).lean();

    revalidatePath(`/products/${newProduct._id}`);
    
    return {
      ...newProduct,
      _id: newProduct._id.toString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findById(productId).lean();

    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
    };
  } catch (error) {
    console.log(error);
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

export async function getAllProducts(): Promise<
  {
    _id: string;
    name: string;
    price?: string;
    currentPrice?: string;
    image: string;
    url: string;
  }[]
> {
  try {
    await connectToDB();

    const products = (await Product.find()
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

export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();

    const currentProduct = await Product.findById(productId).lean();

    if (!currentProduct) return null;

    const similarProducts = await Product.find({
      _id: { $ne: productId },})
      .limit(3)
      .lean();

    return similarProducts.map((product: { _id: { toString: () => any; }; }) => ({
      ...product,
      _id: product._id.toString(),
    }));
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
  try {
    //Send an email to the user
    const product = await Product.findById(productId);

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
