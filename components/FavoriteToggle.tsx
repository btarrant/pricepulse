"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getFavorites, saveFavorite, removeFavorite } from "@/lib/favorites";

type Props = {
  productId: string;
  count?: number;
};

const FavoriteToggle = ({ productId, count = 0 }: Props) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(productId));
  }, [productId]);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(productId);
    } else {
      saveFavorite(productId);
    }
    setIsFav(!isFav);
  };

  return (
    <div className="product-hearts cursor-pointer" onClick={toggleFavorite}>
      <Image
        src={isFav ? "/assets/icons/red-heart.svg" : "/assets/icons/heart.svg"}
        alt="heart"
        width={20}
        height={20}
      />
      <p className="text-base font-semibold text-[#D46F77]">
        {count}
      </p>
    </div>
  );
};

export default FavoriteToggle;
