import { Product } from "@/types";
import FavoriteToggle from "./FavoriteToggle";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  product: Product;
  onUnfavorite?: () => void;
}

const ProductCard = ({ product, onUnfavorite }: Props) => {
  return (
    <Link href={`/products/${product._id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title || "Product image"}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
        <FavoriteToggle
          productId={product._id}
          count={product.users?.length ?? 0}
          onUnfavorite={onUnfavorite}
        />
          <p className="text-black opacity-50 text-lg capitalize">{product.category}</p>
          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
