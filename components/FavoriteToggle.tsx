"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getFavorites, saveFavorite, removeFavorite } from "@/lib/favorites";

type Props = {
  productId: string;
  count?: number;
};

const FavoriteToggle = ({ productId, count }: Props) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(productId));
  }, [productId]);

  const triggerStorageEvent = () => {
    localStorage.setItem("favorites-sync", Date.now().toString());
  };

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(productId);
    } else {
      saveFavorite(productId);
    }
    setIsFav(!isFav);
    triggerStorageEvent();
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
