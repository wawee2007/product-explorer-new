import Link from "next/link";
import { updateProductAction } from "@/app/actions";
import type { Product } from "@/lib/products";

type EditProductFormProps = {
  product: Product;
};

export default function EditProductForm({
  product,
}: EditProductFormProps) {
  const updateAction = updateProductAction.bind(
    null,
    product.id
  );

  return (
    <main className="product-dialog-backdrop">
      <section
        aria-labelledby="edit-product-title"
        aria-modal="true"
        className="product-dialog"
        role="dialog"
      >
        <header className="product-dialog-header">
          <div className="product-dialog-heading">
            <span className="product-dialog-icon" aria-hidden="true">
              ✎
            </span>
            <div>
              <span className="product-dialog-eyebrow">
                PRODUCT DETAILS
              </span>
              <h1 id="edit-product-title">แก้ไขสินค้า</h1>
              <p>ปรับข้อมูลสินค้าให้เป็นปัจจุบัน</p>
            </div>
          </div>
          <Link
            aria-label="ปิดหน้าต่างแก้ไข"
            className="product-dialog-close"
            href="/"
          >
            ×
          </Link>
        </header>

        <form action={updateAction} className="product-edit-form">
          <div className="product-edit-fields">
            <div className="product-edit-field">
              <label htmlFor="name">ชื่อสินค้า</label>
              <input
                autoComplete="off"
                autoFocus
                id="name"
                name="name"
                defaultValue={product.name}
                required
              />
            </div>

            <div className="product-edit-field">
              <label htmlFor="price">ราคา</label>
              <div className="product-price-input">
                <span aria-hidden="true">฿</span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={product.price}
                  required
                />
              </div>
            </div>

            <div className="product-edit-field product-edit-description">
              <label htmlFor="description">รายละเอียดสินค้า</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={product.description}
                required
              />
            </div>
          </div>

          <footer className="product-dialog-footer">
            <span>กรุณาตรวจสอบข้อมูลก่อนบันทึก</span>
            <div className="product-dialog-actions">
              <Link className="product-cancel-button" href="/">
                ยกเลิก
              </Link>
              <button className="product-save-button" type="submit">
                บันทึกการแก้ไข
              </button>
            </div>
          </footer>
        </form>
      </section>
    </main>
  );
}
