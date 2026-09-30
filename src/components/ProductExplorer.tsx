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
    // กรณีแก้ไข
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

    // กรณีเพิ่มสินค้า
    const newProduct: Product = {
      id: Date.now(),

      ...draft,

      // สินค้าที่เพิ่มใหม่ยังไม่มีรูปจาก API
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

    // ถ้ากำลังแก้สินค้าที่ถูกลบ
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
      <div className="page-header">
        <h1>รายการสินค้า</h1>

        <p>
          จัดการสินค้า ค้นหา เพิ่ม แก้ไข
          และลบสินค้า
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
          Product Table
      ===================== */}

      <section className="card">
        <div className="section-title table-heading">
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
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>รูป</th>
                    <th>ชื่อสินค้า</th>
                    <th>ราคา</th>
                    <th>คงเหลือ</th>
                    <th>หมวดหมู่</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(
                    (product) => (
                      <tr key={product.id}>
                        {/* รูปสินค้า */}
                        <td>
                          <img
                            className="product-image"
                            src={
                              product.thumbnail ||
                              "https://dummyjson.com/image/150x150"
                            }
                            alt={product.title}
                          />
                        </td>

                        {/* ชื่อ */}
                        <td className="product-name">
                          {product.title}
                        </td>

                        {/* ราคา */}
                        <td>
                          ${product.price}
                        </td>

                        {/* Stock */}
                        <td>
                          {product.stock}
                        </td>

                        {/* Category */}
                        <td>
                          <span className="category">
                            {product.category}
                          </span>
                        </td>

                        {/* Buttons */}
                        <td>
                          <div className="actions">
                            <button
                              className="edit-button"
                              onClick={() =>
                                editProduct(
                                  product
                                )
                              }
                            >
                              แก้ไข
                            </button>

                            <button
                              className="delete-button"
                              onClick={() =>
                                removeProduct(
                                  product.id
                                )
                              }
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
      </section>
    </main>
  );
}