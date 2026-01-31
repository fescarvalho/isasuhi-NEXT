"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- GESTÃO DE PRODUTOS ---

export async function saveProduct(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;

    // Captura o checkbox (vem "on" do HTML ou "true" se enviado via JS)
    const isFeatured =
      formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";

    // Formata o nome da categoria para ficar Bonito (ex: "combos" -> "Combos")
    const categoryName = categoryId
      ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
      : "Geral";

    // Lógica inteligente: Conecta à categoria se existir, ou CRIA se não existir
    const categoryConnection = {
      connectOrCreate: {
        where: { id: categoryId },
        create: {
          id: categoryId,
          name: categoryName,
        },
      },
    };

    if (id) {
      // ATUALIZAR
      await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          imageUrl,
          category: categoryConnection,
          isFeatured, // ✅ Salva o destaque corretamente
        },
      });
    } else {
      // CRIAR
      await prisma.product.create({
        data: {
          name,
          description,
          price,
          imageUrl,
          category: categoryConnection,
          isFeatured, // ✅ Salva o destaque corretamente
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/produtos");

    // ✅ SUCESSO: Retorna objeto para o front fazer o redirect
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar produto:", error);
    // ❌ ERRO: Retorna objeto de erro
    return { success: false, error: "Erro ao salvar no banco de dados." };
  }
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/produtos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar:", error);
    return { success: false };
  }
}

// --- CONTROLE DA LOJA (MANUAL) ---

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
  // Busca no banco de dados se a loja foi fechada manualmente.
  // Se não tiver configuração (primeiro acesso), retorna TRUE (Aberta) para receber pedidos.
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
  // Verifica se a dona fechou a loja manualmente
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

  revalidatePath(`/pedido/${orderId}`);
  revalidatePath("/admin/pedidos");
}

// --- ZERAR SISTEMA ---
export async function clearAllOrders() {
  try {
    await prisma.$transaction([
      prisma.orderItem.deleteMany({}),
      prisma.order.deleteMany({}),
    ]);

    revalidatePath("/admin/pedidos");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("Erro ao zerar banco:", error);
    throw new Error("Não foi possível excluir os pedidos.");
  }
}
