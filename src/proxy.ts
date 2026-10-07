// Next.js 16 ใช้ proxy แทน middleware เดิม
export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/products/:id/edit",
    "/products/:id/delete",
  ],
};