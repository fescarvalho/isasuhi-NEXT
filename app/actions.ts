"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- GESTÃO DE PRODUTOS ---

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
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/produtos");
}



export async function toggleStoreOpen() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "settings" } });
  const newState = settings ? !settings.isOpen : false;

  await prisma.storeSettings.upsert({
    where: { id: "settings" },
    update: { isOpen: newState },
    create: { id: "settings", isOpen: false }, 
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function getStoreStatus() {
  const settings = await prisma.storeSettings.findUnique({ where: { id: "settings" } });
  return settings ? settings.isOpen : true;
}

// --- PEDIDOS ---

interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  changeFor?: string;
  cart: { id: string; name: string; price: number; quantity: number }[];
  total: number;
}

export async function createOrder(data: CreateOrderData) {
 
  const isOpen = await getStoreStatus();
  if (!isOpen) {
    throw new Error("LOJA_FECHADA");
  }

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

export async function updateOrderStatus(orderId: string, newStatus: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  // Isso força a atualização tanto no admin quanto na página do cliente
  revalidatePath(`/pedido/${orderId}`);
  revalidatePath("/admin/pedidos");
}
/* export async function clearAllOrders() {
  try {
    // Usamos uma transação para garantir que ambas as exclusões ocorram com sucesso
    await prisma.$transaction([
      // 1. Primeiro apagamos todos os itens dos pedidos
      prisma.orderItem.deleteMany({}),
      // 2. Depois apagamos os pedidos em si
      prisma.order.deleteMany({}),
    ]);

    // Limpa o cache para atualizar a tela do admin imediatamente
    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Erro ao zerar banco:", error);
    throw new Error("Não foi possível excluir os pedidos.");
  }
}
 */
