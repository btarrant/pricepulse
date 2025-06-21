"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    return (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    );
  } catch (error) {
    return false;
  }
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<{
    name: string;
    price: string;
    image: string;
    url: string;
  } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductUrl(searchPrompt);
    if (!isValidLink) return alert("Please provide a valid Amazon link");

    try {
      setIsLoading(true);
      const product = await scrapeAndStoreProduct(searchPrompt);
      if (product) {
        setProduct({
          name: product.title ?? "Untitled Product",
          price: `$${product.currentPrice.toFixed(2)}`,
          image: product.image,
          url: product.url,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchPrompt}
          onChange={(e) => setSearchPrompt(e.target.value)}
          placeholder="Enter product link"
          className="searchbar-input"
        />
        <button type="submit" className="searchbar-btn" disabled={searchPrompt === ""}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {product && (
        <div className="mt-8 p-4 border rounded-lg max-w-sm shadow-md">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto mb-4 object-contain"
          />
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-green-600 font-bold mb-2">{product.price}</p>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Product
          </a>
        </div>
      )}
    </>
  );
};

export default Searchbar;
