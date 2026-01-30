"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// 1. GESTÃO DE PRODUTOS
// ==========================================

export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (id) {
    await prisma.product.update({
      where: { id },
      data: { name, description, price, categoryId, imageUrl },
    });
  } else {
    await prisma.product.create({
      data: { name, description, price, categoryId, imageUrl },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;

  await prisma.product.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin");
}

// ==========================================
// 2. CHECKOUT (CRIAR PEDIDO)
// ==========================================

interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  changeFor?: string;
  cart: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

export async function createOrder(data: CreateOrderData) {
  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      changeFor: data.changeFor,
      total: data.total,
      status: "PENDENTE",
      items: {
        create: data.cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
  });

  return { orderId: order.id };
}

// ==========================================
// 3. ATUALIZAR STATUS (Estava faltando essa!)
// ==========================================

export async function updateOrderStatus(orderId: string, newStatus: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  // Atualiza tanto a página do cliente quanto a lista do admin
  revalidatePath(`/pedido/${orderId}`);
  revalidatePath("/admin/pedidos");
}
