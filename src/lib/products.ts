import { z } from "zod";

export const CATEGORIES = [
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
  "home-decoration",
  "kitchen-accessories",
  "laptops",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "mobile-accessories",
  "motorcycle",
  "skin-care",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "tablets",
  "tops",
  "vehicle",
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
] as const;

// =========================
// Product Schema
// =========================

export const ProductSchema = z.object({
  id: z.number(),

  title: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อสินค้า"),

  price: z
    .number({ error: "กรุณากรอกราคา" })
    .min(0, "ราคาต้องไม่ติดลบ"),

  stock: z
    .number({ error: "กรุณากรอกจำนวนคงเหลือ" })
    .int("จำนวนคงเหลือต้องเป็นจำนวนเต็ม")
    .min(0, "จำนวนคงเหลือต้องไม่ติดลบ"),

  category: z.enum(CATEGORIES, {
    error: "กรุณาเลือกหมวดหมู่",
  }),

  // รูปสินค้า
  thumbnail: z.string().optional(),
});

// =========================
// Product List Schema
// =========================

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

// =========================
// Types
// =========================

export type Product = z.infer<typeof ProductSchema>;

export type ProductList = z.infer<typeof ProductListSchema>;

// =========================
// API
// =========================

const API_BASE = "https://dummyjson.com";

export const SORT_FIELDS = [
  "title",
  "price",
  "stock",
] as const;

// =========================
// Search Schema
// =========================

export const SearchQuerySchema = z.object({
  q: z.string().trim(),

  limit: z
    .number({ error: "กรุณากรอกจำนวนรายการ" })
    .int("จำนวนรายการต้องเป็นจำนวนเต็ม")
    .min(1, "อย่างน้อย 1 รายการ")
    .max(30, "ไม่เกิน 30 รายการ"),

  sortBy: z.enum(SORT_FIELDS),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

// =========================
// Default Search
// =========================

export const defaultQuery: SearchQuery = {
  q: "",
  limit: 10,
  sortBy: "title",
};

// =========================
// Build API URL
// =========================

export function buildProductUrl(query: SearchQuery): string {
  const params = new URLSearchParams();

  params.set("q", query.q);
  params.set("limit", String(query.limit));
  params.set("sortBy", query.sortBy);
  params.set("order", "asc");

  // เพิ่ม thumbnail เพื่อเอารูปสินค้า
  params.set(
    "select",
    "title,price,stock,category,thumbnail"
  );

  return `${API_BASE}/products/search?${params.toString()}`;
}

// =========================
// Fetch Products
// =========================

export async function fetchProducts(
  query: SearchQuery
): Promise<ProductList> {
  const response = await fetch(
    buildProductUrl(query)
  );

  if (!response.ok) {
    throw new Error(
      `เรียกข้อมูลไม่สำเร็จ สถานะ ${response.status}`
    );
  }

  const data = await response.json();

  const result =
    ProductListSchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      "รูปแบบข้อมูลที่ได้รับไม่ตรงกับที่กำหนดไว้"
    );
  }

  return result.data;
}

// =========================
// Product Draft
// =========================

export const ProductDraftSchema =
  ProductSchema.omit({
    id: true,
  });

export type ProductDraft =
  z.infer<typeof ProductDraftSchema>;