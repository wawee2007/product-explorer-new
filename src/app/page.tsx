import Link from "next/link";
import { auth } from "@/auth";
import { getProducts } from "@/lib/products";
import { AuthButtons } from "./auth-buttons";
import { ProductImage } from "./product-image";

export default async function HomePage() {
  const session = await auth();
  const products = getProducts();
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="luxury-site">
      {/* =========================
          HEADER
      ========================= */}
      <header className="luxury-header">
        <Link href="/" className="luxury-logo">
          <span className="logo-mark">P</span>

          <span className="logo-text">
            PRODUCT
            <small>EXPLORER</small>
          </span>
        </Link>

        <nav className="luxury-nav">
          <Link href="/">Products</Link>

          <span className="nav-line" />

          <span className="nav-status">
            {isLoggedIn ? "MEMBER" : "GUEST"}
          </span>
        </nav>

        <div className="luxury-auth">
          <AuthButtons
            isLoggedIn={isLoggedIn}
            userName={session?.user?.name}
          />
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}
      <section className="luxury-hero">
        <div className="hero-content">
          <p className="eyebrow">PRODUCT MANAGEMENT</p>

          <h1>
            Products
            <br />
            <span>made simple.</span>
          </h1>

          <p className="hero-description">
            จัดการข้อมูลสินค้าอย่างเป็นระบบ
            ดูรายละเอียด แก้ไข และลบสินค้า
            ได้จากพื้นที่เดียว
          </p>

          <div className="hero-meta">
            <span>AVAILABLE PRODUCTS</span>

            <strong>
              {String(products.length).padStart(2, "0")}
            </strong>
          </div>
        </div>

        <div className="hero-number">
          <span>ESTABLISHED</span>
          <strong>2026</strong>
        </div>
      </section>

      {/* =========================
          PRODUCTS
      ========================= */}
      <section className="luxury-products">
        <div className="products-heading">
          <div>
            <p className="eyebrow">PRODUCT COLLECTION</p>

            <h2>รายการสินค้า</h2>
          </div>

          <div className="heading-count">
            {products.length.toString().padStart(2, "0")} ITEMS
          </div>
        </div>

        {products.length > 0 ? (
          <div className="luxury-grid">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="luxury-card"
                data-testid="product"
              >
                {/* Card Header */}
                <div className="card-top">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{product.id}</span>
                </div>

                {/* Product Image */}
                <div className="card-image">
                  <ProductImage
                    alt={product.name}
                    imageUrl={product.imageUrl}
                  />
                </div>

                {/* Product Information */}
                <div className="card-info">
                  <p className="card-category">
                    PRODUCT
                  </p>

                  <h3>{product.name}</h3>

                  <p className="card-description">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="card-bottom">
                    <div>
                      <span className="price-label">
                        PRICE
                      </span>

                      <strong>
                        ฿{product.price.toLocaleString("th-TH")}
                      </strong>
                    </div>

                    <span className="card-arrow">
                      ↗
                    </span>
                  </div>

                  {/* Actions */}
                  {isLoggedIn && (
                    <div className="luxury-actions">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="luxury-edit"
                      >
                        <span>แก้ไขสินค้า</span>
                        <span className="action-arrow">
                          →
                        </span>
                      </Link>

                      <Link
                        href={`/products/${product.id}/delete`}
                        className="luxury-delete"
                      >
                        ลบสินค้า
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="luxury-empty">
            <span>NO PRODUCTS</span>

            <p>
              ขณะนี้ยังไม่มีสินค้าในระบบ
            </p>
          </div>
        )}
      </section>

      {/* =========================
          FOOTER
      ========================= */}
      <footer className="luxury-footer">
        <span>PRODUCT EXPLORER</span>

        <span>
          PRODUCT MANAGEMENT SYSTEM
        </span>

        <span>2026</span>
      </footer>
    </main>
  );
}