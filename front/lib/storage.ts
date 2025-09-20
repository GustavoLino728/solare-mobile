export function getFavorites(): string[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  }
  
  export function setFavorites(favorites: string[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  
  export function toggleFavorite(id: string) {
    const favorites = getFavorites();
    const index = favorites.indexOf(id);
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(id);
    }
    setFavorites(favorites);
  }
  
  // Quantities
  export function getQuantities(): Record<string, number> {
    if (typeof window === "undefined") return {};
    return JSON.parse(localStorage.getItem("quantities") || "{}");
  }
  
  export function setQuantity(id: string, qty: number) {
    if (typeof window === "undefined") return;
    const quantities = getQuantities();
    quantities[id] = qty;
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }
  
  export function removeQuantity(id: string) {
    if (typeof window === "undefined") return;
    const quantities = getQuantities();
    delete quantities[id];
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }
  