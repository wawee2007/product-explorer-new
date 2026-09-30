"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  SORT_FIELDS,
  SearchQuerySchema,
  defaultQuery,
} from "@/lib/products";

import type {
  SearchQuery,
} from "@/lib/products";

type ProductSearchFormProps = {
  onSearch: (
    query: SearchQuery
  ) => Promise<void>;
};

export default function ProductSearchForm({
  onSearch,
}: ProductSearchFormProps) {
  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SearchQuery>({
    resolver:
      zodResolver(
        SearchQuerySchema
      ),

    mode: "onTouched",

    defaultValues:
      defaultQuery,
  });

  return (
    <form
      className="search-form"
      onSubmit={handleSubmit(
        onSearch
      )}
      noValidate
    >
      {/* คำค้น */}
      <div className="search-field search-keyword">
        <label htmlFor="q">
          คำค้นหา
        </label>

        <input
          id="q"
          type="text"
          placeholder="เช่น phone"
          {...register("q")}
        />
      </div>

      {/* จำนวน */}
      <div className="search-field">
        <label htmlFor="limit">
          จำนวนรายการ
        </label>

        <input
          id="limit"
          type="number"
          min="1"
          max="30"
          {...register("limit", {
            valueAsNumber: true,
          })}
          aria-invalid={!!errors.limit}
        />

        {errors.limit && (
          <span className="field-error">
            {errors.limit.message}
          </span>
        )}
      </div>

      {/* เรียง */}
      <div className="search-field">
        <label htmlFor="sortBy">
          เรียงตาม
        </label>

        <select
          id="sortBy"
          {...register("sortBy")}
        >
          {SORT_FIELDS.map(
            (field) => (
              <option
                key={field}
                value={field}
              >
                {field}
              </option>
            )
          )}
        </select>
      </div>

      {/* ปุ่มค้นหา */}
      <div className="search-button-wrapper">
        <button
          type="submit"
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "กำลังค้นหา..."
            : "ค้นหา"}
        </button>
      </div>
    </form>
  );
}