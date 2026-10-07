import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteAction = deleteProductAction.bind(null, product.id);

  return (
    <main className="product-dialog-backdrop">
      <section
        aria-labelledby="delete-product-title"
        aria-modal="true"
        className="product-dialog product-delete-dialog"
        role="dialog"
      >
        <header className="product-dialog-header">
          <div className="product-dialog-heading">
            <span className="product-dialog-icon product-delete-icon" aria-hidden="true">
              !
            </span>
            <div>
              <span className="product-dialog-eyebrow">DELETE PRODUCT</span>
              <h1 id="delete-product-title">ยืนยันการลบสินค้า</h1>
            </div>
          </div>
          <Link
            aria-label="ปิดหน้าต่างยืนยันการลบ"
            className="product-dialog-close"
            href="/"
          >
            ×
          </Link>
        </header>

        <p className="product-delete-message">
          ต้องการลบ <strong>{product.name}</strong> ใช่หรือไม่?
          <span>เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลสินค้าได้</span>
        </p>

        <footer className="product-dialog-footer">
          <span>โปรดยืนยันก่อนดำเนินการ</span>
          <div className="product-dialog-actions">
            <Link className="product-cancel-button" href="/">
              ยกเลิก
            </Link>
            <form action={deleteAction}>
              <button
                className="product-confirm-delete-button"
                type="submit"
              >
                ลบสินค้า
              </button>
            </form>
          </div>
        </footer>
      </section>
    </main>
  );
}