"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFavorites } from "@/lib/favorites";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const [hasFavorites, setHasFavorites] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

useEffect(() => {
  const updateFavorites = async () => {
    if (user) {
      try {
        const res = await fetch("/api/user/favorites");
        const data = await res.json();
        setHasFavorites(data?.length > 0);
      } catch (err) {
        console.error("Failed to fetch user favorites:", err);
        setHasFavorites(false);
      }
    } else {
      const favs = getFavorites();
      setHasFavorites(favs.length > 0);
    }
  };

  updateFavorites();

  // Wrap async call in a regular function for event listener
  const handleFavoritesUpdated = () => {
    updateFavorites();
  };

  window.addEventListener("favorites-updated", handleFavoritesUpdated);
  return () => window.removeEventListener("favorites-updated", handleFavoritesUpdated);
}, [user]);


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
          <Link href="/search">
            <Image
              src="/assets/icons/search.svg"
              alt="search"
              width={28}
              height={28}
              className="object-contain"
            />
          </Link>
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
          <Link href="/profile">
            <Image
              src="/assets/icons/user.svg"
              alt="user"
              width={28}
              height={28}
              className="object-contain"
            />
          </Link>

          {user ? (
            <button
              onClick={() => signOut()}
              className="text-sm underline text-gray-700"
            >
              Sign out ({user.email})
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-sm underline text-primary"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
