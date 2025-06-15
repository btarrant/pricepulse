import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  { src: "/assets/icons/search.svg", alt: "search" },
  { src: "/assets/icons/black-heart.svg", alt: "heart" },
  { src: "/assets/icons/user.svg", alt: "user" },
];

const Navbar = () => {
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
          {navIcons.map((icon) => {
            const isHeart = icon.alt === "heart";
            const href = isHeart ? "/favorites" : "#";

            return (
              <Link href={href} key={icon.alt} aria-label={icon.alt}>
                <Image
                  src={icon.src}
                  alt={icon.alt}
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
