import { scrapeAmazonProduct } from "./amazon";
import { scrapeWalmartProduct } from "./walmart";
import { scrapeEBayProduct } from "./ebay";
import { scrapeTargetProduct } from "./target";
import { scrapeLowesProduct } from "./lowes";
import { scrapeBestBuyProduct } from "./bestbuy";
import { scrapeHomeDepotProduct } from "./homedepot";
import { scrapeCraigslistProduct } from "./craigslist";

export type ScrapedProduct = {
  url: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  currency: string;
  discountRate: number;
  category: string;
  reviewsCount: number;
  stars: number;
  isOutOfStock: boolean;
  description: string;
  priceHistory: { price: number; date: string }[];
};

export async function scrapeProductByUrl(url: string): Promise<ScrapedProduct | null> {
  const hostname = new URL(url).hostname;

  if (hostname.includes("amazon")) return scrapeAmazonProduct(url);
  if (hostname.includes("walmart")) return scrapeWalmartProduct(url);
  if (hostname.includes("ebay")) return scrapeEBayProduct(url);
  if (hostname.includes("bestbuy")) return scrapeBestBuyProduct(url);
  if (hostname.includes("target")) return scrapeTargetProduct(url);
  if (hostname.includes("lowes")) return scrapeLowesProduct(url);
  if (hostname.includes("homedepot")) return scrapeHomeDepotProduct(url);
  if (hostname.includes("craigslist")) return scrapeCraigslistProduct(url);

  throw new Error("Unsupported domain: " + hostname);
}
