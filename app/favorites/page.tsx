// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/favorites";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import Link from "next/link";

const FavoritesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

const [sortOption, setSortOption] = useState("default");
const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    const fetchFavorites = async () => {
      const ids = getFavorites();

      if (ids.length === 0) return;

      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch favorite products:", err);
      }
    };

    fetchFavorites();
  }, []);

  const sortedAndFiltered = products
  .filter((p) => filterCategory === "all" || p.category === filterCategory)
  .sort((a, b) => {
    if (sortOption === "price-low") return a.currentPrice - b.currentPrice;
    if (sortOption === "price-high") return b.currentPrice - a.currentPrice;
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>

      <div className="flex gap-4">
    <select
      value={sortOption}
      onChange={(e) => setSortOption(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="default">Sort By</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>

    <select
      value={filterCategory}
      onChange={(e) => setFilterCategory(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="all">All Categories</option>
      {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 mt-16">
          <Image
            src="/assets/images/favoriteicon.svg"
            alt="No favorites yet"
            width={300}
            height={300}
          />
          <p className="text-lg text-gray-600">You haven’t added any favorites yet.</p>
          <Link
              href="/#trending"
              scroll={true}
              className="btn bg-primary text-white px-6 py-2 rounded-md"
            >
              Browse Products
            </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-8">
          {sortedAndFiltered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
