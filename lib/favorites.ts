// lib/favorites.ts

export const getFavorites = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  };
  
  export const saveFavorite = (productId: string) => {
    const current = getFavorites();
    if (!current.includes(productId)) {
      localStorage.setItem("favorites", JSON.stringify([...current, productId]));
    }
  };
  
  export const removeFavorite = (productId: string) => {
    const updated = getFavorites().filter((id) => id !== productId);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };
  
  export const isFavorited = (productId: string): boolean => {
    return getFavorites().includes(productId);
  };
  