import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice, extractDescription } from "../utils";
import { Product } from "@/types";

export type ScrapedProduct = Omit<Product, "_id" | "users">;

export async function scrapeAmazonProduct(url: string): Promise<ScrapedProduct | undefined> {
  if (!url) return;

  // BrightData proxy config
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 33335;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Extract product title
    let title = 
      $("#productTitle").text().trim() ||
      $(".product-title-word-break").text().trim() ||
      $("h1 span#title").text().trim();

    const currentPrice = extractPrice(
      $(`.priceToPay span.a-price-whole`),
      $(`a.size.base.a-color-price`),
      $(`.a-button-selected .a-color-base`)
    );

    const originalPrice = extractPrice(
      $(`#priceblock_ourprice`),
      $(`.a-price.a-text-price span.a-offscreen`),
      $(`#listPrice`),
      $(`.a-size-base.a-color-price`)
    );

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() === "currently unavailable";

    const images =
      $(`#imgBlkFront`).attr("data-a-dynamic-image") ||
      $(`#landingImage`).attr("data-a-dynamic-image") ||
      "{}";

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

    const description = extractDescription($);

    // Construct data object with scraped information
    const data = {
      url,
      currency: currency || "$",
      image: imageUrls[0],
      title,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [
        {
          price: Number(currentPrice) || Number(originalPrice),
          date: new Date().toISOString(),
        },
      ],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: Number(currentPrice) || Number(currentPrice),
      highestPrice: Number(originalPrice) || Number(originalPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
