"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

// NOTE: Original MongoDB-connected version is commented out below.
// For demo purposes, we've mocked the return data to avoid external DB dependencies.

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    // Simulate a network/database delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProduct = {
      _id: "mock123",
      name: "Kakanuo Lamp – Charging Dimmable Nightstand",
      url: "https://www.amazon.com/Kakanuo-Charging-Dimmable-Nightstand-Included/dp/B0C38TZDZS",
      currentPrice: "$29.99",
      priceHistory: [
        { price: "$29.99" },
        { price: "$24.99" },
      ],
      lowestPrice: "$24.99",
      highestPrice: "$29.99",
      averagePrice: "$27.49",
      image: "/assets/images/lamp.jpg",
      users: [],
    };

    return newProduct;
  } catch (error: any) {
    throw new Error(`Failed to mock product: ${error.message}`);
  }
}

// export async function scrapeAndStoreProduct(productUrl: string) {
//   if (!productUrl) return;

//   try {
//     connectToDB();

//     const scrapedProduct = await scrapeAmazonProduct(productUrl);

//     if (!scrapedProduct) return;

//     let product = scrapedProduct;

//     const existingProduct = await Product.findOne({ url: scrapedProduct.url });

//     if (existingProduct) {
//       const updatedPriceHistory: any = [
//         ...existingProduct.priceHistory,
//         { price: scrapedProduct.currentPrice },
//       ];

//       product = {
//         ...scrapedProduct,
//         priceHistory: updatedPriceHistory,
//         lowestPrice: getLowestPrice(updatedPriceHistory),
//         highestPrice: getHighestPrice(updatedPriceHistory),
//         averagePrice: getAveragePrice(updatedPriceHistory),
//       };
//     }

//     const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, {
//       upsert: true,
//       new: true,
//     });

//     revalidatePath(`/products/${newProduct._id}`);
//   } catch (error: any) {
//     throw new Error(`Failed to create/update product: ${error.message}`);
//   }
// }

// export async function getProductById(productId: string) {
//   try {
//     connectToDB();

//     const product = await Product.findOne({ _id: productId });

//     if (!product) return null;

//     return product;
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function getAllProducts() {
  try {
    // connectToDB();

    // const products = await Product.find();

    return [];
  } catch (error) {
    console.log(error);
  }
}
// export async function getSimilarProducts(productId: string) {
//   try {
//     connectToDB();

//     const currentProduct = await Product.findById(productId);

//     if (!currentProduct) return null;

//     const similarProducts = await Product.find({
//       _id: { $ne: productId },
//     }).limit(3);

//     return similarProducts;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function addUserEmailToProduct(productId: string, userEmail: string) {
//   try {
//     //Send an email to the user
//     const product = await Product.findById(productId);

//     if (!product) return;

//     const userExists = product.users.some((user: User) => user.email === userEmail);

//     if (!userExists) {
//       product.users.push({ email: userEmail });

//       await product.save();

//       const emailContent = await generateEmailBody(product, "WELCOME");

//       await sendEmail(emailContent, [userEmail]);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
