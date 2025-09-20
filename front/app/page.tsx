"use client";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import { Product } from "@/lib/api"
import { getFavorites, toggleFavorite } from "@/lib/storage";
import { fetchProducts } from "@/lib/api";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<string[]>(getFavorites());

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setProducts(data);
    }
    load();
  }, []);

  function handleToggleFavorite(id) {
    const updated = toggleFavorite(id);
    setFavorites(updated);
  }

  return (
    <div className="container">
      <SearchBar />
      <Filters />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favorites.includes(product.id.toString())}
            toggleFavorite={handleToggleFavorite}
            openModal={setSelectedProduct}
          />
        ))}
      </div>

      <ProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
}
