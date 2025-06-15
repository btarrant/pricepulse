"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/favorites";

const Navbar = () => {
  const [hasFavorites, setHasFavorites] = useState(false);

  useEffect(() => {
    // Initial check
    const favorites = getFavorites();
    setHasFavorites(favorites.length > 0);
  }, []);

  useEffect(() => {
    const syncFavorites = () => {
      const favorites = getFavorites();
      setHasFavorites(favorites.length > 0);
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, []);

  // Optional: refresh on focus (in case user navigates away/back)
  useEffect(() => {
    const onFocus = () => {
      const favorites = getFavorites();
      setHasFavorites(favorites.length > 0);
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/assets/icons/logo.svg" width={27} height={27} alt="logo" />
          <p className="nav-logo">
            Price<span className="text-primary">Pulse</span>
          </p>
        </Link>

        <div className="flex items-center gap-5">
          <Image
            src="/assets/icons/search.svg"
            alt="search"
            width={28}
            height={28}
            className="object-contain"
          />

          <Link href="/favorites">
            <Image
              src={
                hasFavorites
                  ? "/assets/icons/red-heart.svg"
                  : "/assets/icons/black-heart.svg"
              }
              alt="favorites"
              width={28}
              height={28}
              className="object-contain"
            />
          </Link>

          <Image
            src="/assets/icons/user.svg"
            alt="user"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
