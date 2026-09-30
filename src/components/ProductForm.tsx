"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  CATEGORIES,
  ProductDraftSchema,
} from "@/lib/products";

import type {
  Product,
  ProductDraft,
} from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;

  onSave: (
    draft: ProductDraft
  ) => void;

  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
      isDirty,
      isValid,
    },
  } = useForm<ProductDraft>({
    resolver:
      zodResolver(ProductDraftSchema),

    mode: "onTouched",

    defaultValues: {
      title: "",
      price: undefined,
      stock: undefined,
      category: undefined,
    },
  });

  // =========================
  // เมื่อเลือกสินค้าเพื่อแก้ไข
  // =========================

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        category: editing.category,
      });
    } else {
      reset({
        title: "",
        price: undefined,
        stock: undefined,
        category: undefined,
      });
    }
  }, [editing, reset]);

  // =========================
  // Save
  // =========================

  function saveProduct(
    values: ProductDraft
  ) {
    onSave(values);

    if (!editing) {
      reset();
    }
  }

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit(
        saveProduct
      )}
      noValidate
    >
      {/* ชื่อสินค้า */}
      <div className="form-group">
        <label htmlFor="title">
          ชื่อสินค้า
        </label>

        <input
          id="title"
          type="text"
          placeholder="เช่น iPhone 15"
          {...register("title")}
          aria-invalid={!!errors.title}
        />

        {errors.title && (
          <span className="field-error">
            {errors.title.message}
          </span>
        )}
      </div>

      {/* ราคา */}
      <div className="form-group">
        <label htmlFor="price">
          ราคา
        </label>

        <input
          id="price"
          type="number"
          placeholder="0.00"
          step="0.01"
          {...register("price", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.price}
        />

        {errors.price && (
          <span className="field-error">
            {errors.price.message}
          </span>
        )}
      </div>

      {/* จำนวน */}
      <div className="form-group">
        <label htmlFor="stock">
          จำนวนคงเหลือ
        </label>

        <input
          id="stock"
          type="number"
          placeholder="0"
          {...register("stock", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.stock}
        />

        {errors.stock && (
          <span className="field-error">
            {errors.stock.message}
          </span>
        )}
      </div>

      {/* หมวดหมู่ */}
      <div className="form-group">
        <label htmlFor="category">
          หมวดหมู่
        </label>

        <select
          id="category"
          {...register("category")}
          aria-invalid={!!errors.category}
        >
          <option value="">
            กรุณาเลือกหมวดหมู่
          </option>

          {CATEGORIES.map(
            (category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>

        {errors.category && (
          <span className="field-error">
            {errors.category.message}
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="form-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={
            !isDirty || !isValid
          }
        >
          {editing
            ? "บันทึกการแก้ไข"
            : "เพิ่มสินค้า"}
        </button>

        {editing && (
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}