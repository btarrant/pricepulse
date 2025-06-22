import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice, extractDescription } from "../utils";
import { Product } from "@/types";

export type ScrapedProduct = Omit<Product, "_id" | "users">;

export async function scrapeWalmartProduct(url: string): Promise<ScrapedProduct | null> {
  if (!url) return null;

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
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);

    // Walmart uses JSON-LD structured data embedded in script tag
    const scriptTag = $('script[type="application/ld+json"]').html();
    const jsonData = scriptTag ? JSON.parse(scriptTag) : null;

    const title =
        $("h1.prod-ProductTitle").text().trim() ||
        jsonData?.name?.toString().trim() ||
        "Unknown Product";


    const currentPrice = extractPrice(
      $('[itemprop="price"]'),
      $('span[data-automation-id="price"]'),
      $('span.price-characteristic')
    );

    const originalPrice = extractPrice(
      $('span.price-old'),
      $('div.mr1 span.lh-copy'),
      $('div.lh-copy strike')
    );

    const outOfStock =
      $("div[data-automation-id='buyBox-message']").text().toLowerCase().includes("out of stock");

    const image =
      $('img.prod-hero-image-image').attr("src") ||
      $("meta[property='og:image']").attr("content") ||
      "";

    const currency = extractCurrency($('[itemprop="priceCurrency"]')) || "$";
    const discountRate = $(".price-group .visuallyhidden")
      .text()
      .replace(/[-%]/g, "");

    const description = extractDescription($);

    const price = Number(currentPrice) || Number(originalPrice);

    const data = {
      url,
      currency,
      image,
      title,
      currentPrice: price,
      originalPrice: Number(originalPrice) || price,
      priceHistory: [
        {
          price,
          date: new Date().toISOString(),
        },
      ],
      discountRate: Number(discountRate) || 0,
      category: jsonData?.category || "category",
      reviewsCount: Number(jsonData?.review?.reviewCount) || 100,
      stars: Number(jsonData?.aggregateRating?.ratingValue) || 4.5,
      isOutOfStock: outOfStock,
      description,
      lowestPrice: price,
      highestPrice: Number(originalPrice) || price,
      averagePrice: price,
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape Walmart product: ${error.message}`);
  }
}
