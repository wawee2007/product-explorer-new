"use client";

import { useEffect, useState } from "react";

import {
  defaultQuery,
  fetchProducts,
} from "@/lib/products";

import type {
  Product,
  ProductDraft,
  ProductList,
  SearchQuery,
} from "@/lib/products";

import ProductForm from "./ProductForm";
import ProductSearchForm from "./ProductSearchForm";

type LoadState =
  | "loading"
  | "error"
  | "ready";

type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
};

type ProductWithDetails = Product & {
  description?: string;
  brand?: string;
  rating?: number;
  reviews?: ProductReview[];
};

export default function ProductExplorer() {
  const [products, setProducts] =
    useState<Product[]>([]);

  const [status, setStatus] =
    useState<LoadState>("loading");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  // =========================
  // แสดงผลข้อมูล
  // =========================

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  // =========================
  // แสดง Error
  // =========================

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error
        ? error.message
        : "เรียกข้อมูลไม่สำเร็จ"
    );

    setStatus("error");
  }

  // =========================
  // โหลดสินค้า
  // =========================

  async function loadProducts(
    query: SearchQuery
  ) {
    setStatus("loading");
    setErrorMessage("");

    try {
      const result =
        await fetchProducts(query);

      showResult(result);
    } catch (error) {
      showError(error);
    }
  }

  // =========================
  // เพิ่ม / แก้ไขสินค้า
  // =========================

  function saveProduct(
    draft: ProductDraft
  ) {
    if (editingProduct) {
      setProducts(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...draft,
              }
            : product
        )
      );

      setEditingProduct(null);
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      ...draft,
      thumbnail:
        "https://dummyjson.com/image/150x150",
    };

    setProducts([
      ...products,
      newProduct,
    ]);
  }

  // =========================
  // ลบสินค้า
  // =========================

  function removeProduct(id: number) {
    setProducts(
      products.filter(
        (product) => product.id !== id
      )
    );

    if (
      editingProduct &&
      editingProduct.id === id
    ) {
      setEditingProduct(null);
    }
  }

  // =========================
  // แก้ไขสินค้า
  // =========================

  function editProduct(product: Product) {
    setEditingProduct(product);
  }

  // =========================
  // โหลดข้อมูลตอนเปิดหน้า
  // =========================

  useEffect(() => {
    fetchProducts(defaultQuery)
      .then(showResult)
      .catch(showError);
  }, []);

  // =========================
  // UI
  // =========================

  return (
    <main>
      {/* =====================
          Header
      ===================== */}

      <div className="page-header">
        <h1>รายการสินค้า</h1>

        <p>
          ค้นหา ดูรายละเอียด รีวิว
          และจัดการสินค้า
        </p>
      </div>

      {/* =====================
          Search
      ===================== */}

      <section className="card search-card">
        <div className="section-title">
          <h2>ค้นหาสินค้า</h2>

          <p>
            ค้นหาสินค้าจากข้อมูล API
          </p>
        </div>

        <ProductSearchForm
          onSearch={loadProducts}
        />
      </section>

      {/* =====================
          Product Form
      ===================== */}

      <section className="card">
        <div className="section-title">
          <h2>
            {editingProduct
              ? "แก้ไขสินค้า"
              : "เพิ่มสินค้า"}
          </h2>

          <p>
            {editingProduct
              ? "แก้ไขข้อมูลสินค้าแล้วกดบันทึก"
              : "กรอกข้อมูลเพื่อเพิ่มสินค้าใหม่"}
          </p>
        </div>

        <ProductForm
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() =>
            setEditingProduct(null)
          }
        />
      </section>

      {/* =====================
          Product Cards
      ===================== */}

      <section className="card product-section">
        <div className="section-title product-heading">
          <div>
            <h2>รายการสินค้า</h2>

            <p>
              พบสินค้า {products.length} รายการ
            </p>
          </div>
        </div>

        {status === "loading" && (
          <div className="state-message">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {status === "error" && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        {status === "ready" &&
          products.length === 0 && (
            <div className="state-message">
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </div>
          )}

        {status === "ready" &&
          products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => {
                /*
                 * DummyJSON มีข้อมูลเพิ่มเติม เช่น
                 * description, brand, rating และ reviews
                 */
                const item =
                  product as ProductWithDetails;

                const reviews =
                  item.reviews || [];

                return (
                  <article
                    className="product-card"
                    key={product.id}
                  >
                    {/* รูปสินค้า */}
                    <div className="product-image-box">
                      <img
                        className="product-card-image"
                        src={
                          product.thumbnail ||
                          "https://dummyjson.com/image/300x220"
                        }
                        alt={product.title}
                      />
                    </div>

                    {/* ข้อมูลสินค้า */}
                    <div className="product-card-body">
                      <div className="product-top">
                        <span className="category">
                          {product.category}
                        </span>

                        {item.brand && (
                          <span className="brand">
                            {item.brand}
                          </span>
                        )}
                      </div>

                      <h3 className="product-title">
                        {product.title}
                      </h3>

                      {/* ราคา */}
                      <div className="product-price">
                        ${product.price.toLocaleString()}
                      </div>

                      {/* Rating */}
                      <div className="rating-row">
                        <span className="stars">
                          ⭐
                        </span>

                        <strong>
                          {item.rating
                            ? item.rating.toFixed(1)
                            : "ยังไม่มีคะแนน"}
                        </strong>

                        <span className="review-count">
                          (
                          {reviews.length}
                          {" "}
                          รีวิว)
                        </span>
                      </div>

                      {/* รายละเอียด */}
                      <p className="product-description">
                        {item.description ||
                          "ไม่มีรายละเอียดสินค้า"}
                      </p>

                      {/* Stock */}
                      <div className="stock-row">
                        <span>
                          📦 คงเหลือ
                        </span>

                        <strong>
                          {product.stock} ชิ้น
                        </strong>
                      </div>

                      {/* รีวิว */}
                      <div className="reviews-section">
                        <div className="reviews-title">
                          <span>
                            ⭐ รีวิวจากลูกค้า
                          </span>

                          <span>
                            {reviews.length} รีวิว
                          </span>
                        </div>

                        {reviews.length > 0 ? (
                          <div className="reviews-list">
                            {reviews
                              .slice(0, 3)
                              .map(
                                (
                                  review,
                                  index
                                ) => (
                                  <div
                                    className="review"
                                    key={`${product.id}-${index}`}
                                  >
                                    <div className="review-header">
                                      <strong>
                                        {
                                          review.reviewerName
                                        }
                                      </strong>

                                      <span>
                                        {"⭐".repeat(
                                          Math.min(
                                            5,
                                            Math.max(
                                              1,
                                              review.rating
                                            )
                                          )
                                        )}
                                      </span>
                                    </div>

                                    <p>
                                      {
                                        review.comment
                                      }
                                    </p>
                                  </div>
                                )
                              )}
                          </div>
                        ) : (
                          <p className="no-review">
                            ยังไม่มีรีวิว
                          </p>
                        )}
                      </div>

                      {/* ปุ่ม */}
                      <div className="card-actions">
                        <button
                          className="edit-button"
                          onClick={() =>
                            editProduct(product)
                          }
                        >
                          ✏️ แก้ไข
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            removeProduct(
                              product.id
                            )
                          }
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </section>
    </main>
  );
}