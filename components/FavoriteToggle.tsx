"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getFavorites, saveFavorite, removeFavorite } from "@/lib/favorites";
import { useSession } from "next-auth/react";

type Props = {
  productId: string;
  count?: number;
};

const FavoriteToggle = ({ productId, count }: Props) => {
  const [isFav, setIsFav] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const checkFavorite = async () => {
      if (session?.user) {
        // Optionally fetch user favorites from server if needed
        // But assuming this product is marked from server render
      } else {
        setIsFav(getFavorites().includes(productId));
      }
    };
    checkFavorite();
  }, [productId, session]);

  const triggerFavoritesChange = () => {
    window.dispatchEvent(new Event("favorites-updated"));
  };

  const toggleFavorite = async () => {
    if (session?.user) {
      const method = isFav ? "DELETE" : "POST";
      await fetch("/api/user/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
    } else {
      isFav ? removeFavorite(productId) : saveFavorite(productId);
      triggerFavoritesChange();
    }

    setIsFav((prev) => !prev);
  };

  return (
    <button
      className="product-hearts cursor-pointer"
      onClick={toggleFavorite}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Image
        src={isFav ? "/assets/icons/red-heart.svg" : "/assets/icons/heart.svg"}
        alt="heart"
        width={20}
        height={20}
      />
      {typeof count === "number" && (
        <p className="text-base font-semibold text-[#D46F77]">{count}</p>
      )}
    </button>
  );
};

export default FavoriteToggle;
