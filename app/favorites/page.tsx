// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/favorites";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";

const FavoritesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No favorites yet.</p>
      ) : (
        <div className="flex flex-wrap gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
