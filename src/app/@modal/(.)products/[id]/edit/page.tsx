import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import EditProductForm from "@/app/products/[id]/edit/edit-product-form";

type EditProductModalPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductModalPage({
  params,
}: EditProductModalPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}
