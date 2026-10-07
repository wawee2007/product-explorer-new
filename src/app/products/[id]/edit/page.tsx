import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import EditProductForm from "./edit-product-form";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  // Next 16 ทำ params เป็น Promise จึงต้อง await
  const { id } = await params;

  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}