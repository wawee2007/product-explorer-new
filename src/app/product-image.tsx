import Image from "next/image";
import Link from "next/link";

type ProductImageProps = {
  alt: string;
  imageUrl: string;
};

export function ProductImage({
  alt,
  imageUrl,
}: ProductImageProps) {
  return (
    <>
      <Image
        alt={alt}
        className="product-card-image"
        height={360}
        unoptimized
        src={imageUrl}
        width={640}
      />
      <span className="product-image-credit">
        Photo{" "}
        <Link
          href={`https://unsplash.com/s/photos/${encodeURIComponent(alt)}`}
          target="_blank"
          rel="noreferrer"
        >
          Unsplash
        </Link>
      </span>
    </>
  );
}
