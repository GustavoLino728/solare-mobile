const API_URL = "https://solare-catalogo-hukk.onrender.com/api"

export interface Product {
  id: string;
  name: string;
  img: string;
  price: number;
  category: string;
  description?: string;
  size?: string;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
}

// Fetch all products
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${API_URL}/tags`);
    if (!res.ok) throw new Error("Failed to fetch tags");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Fetch products by tag
export async function fetchProductsByTag(tagId: string): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/tags/${tagId}/products`);
    if (!res.ok) throw new Error(`Failed to fetch products for tag ${tagId}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
