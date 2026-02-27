"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// --- MIDDLEWARE/AUTH HELPER ---
async function verifyAdmin() {
  const headersList = await headers();
  const authHeader = headersList.get("authorization");

  const validUser = process.env.LOGIN;
  const validPass = process.env.SENHA;

  if (!validUser || !validPass) {
    throw new Error("Credenciais do servidor não configuradas.");
  }

  if (!authHeader) {
    throw new Error("Não autorizado");
  }

  const authValue = authHeader.split(" ")[1];
  const [user, pwd] = atob(authValue).split(":");

  if (user !== validUser || pwd !== validPass) {
    throw new Error("Não autorizado");
  }
}

// --- GESTÃO DE PRODUTOS ---

export async function saveProduct(formData: FormData) {
  try {
    await verifyAdmin();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const imageUrl = formData.get("imageUrl") as string;

    // Captura os checkboxes
    const isFeatured =
      formData.get("isFeatured") === "on" || formData.get("isFeatured") === "true";
    const isBanner =
      formData.get("isBanner") === "on" || formData.get("isBanner") === "true";

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
          isFeatured,
          isBanner,
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
          isFeatured,
          isBanner,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/produtos");

    // ✅ SUCESSO: Retorna objeto para o front fazer o redirect
    return { success: true };
  } catch (error: any) {
    console.error("Erro completo ao salvar produto:", error);
    // ❌ ERRO: Retorna objeto de erro
    return { success: false, error: error.message || "Erro ao salvar no banco de dados." };
  }
}

export async function deleteProduct(formData: FormData) {
  try {
    await verifyAdmin();
    const id = formData.get("id") as string;
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
  await verifyAdmin();
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

  // --- RECÁLCULO SEGURO DO PREÇO NO BACKEND ---
  let realTotal = 0;
  const secureCart = [];

  for (const item of data.cart) {
    const dbProduct = await prisma.product.findUnique({
      where: { id: item.id },
      select: { price: true, name: true },
    });

    if (!dbProduct) {
      throw new Error(`Produto não encontrado: ${item.name}`);
    }

    const itemPrice = Number(dbProduct.price);
    realTotal += itemPrice * item.quantity;

    secureCart.push({
      productId: item.id,
      name: dbProduct.name, // Usa o nome real do banco de dados
      price: itemPrice, // Usa o preço real do banco de dados
      quantity: item.quantity,
    });
  }

  // --- ADICIONA A TAXA DE ENTREGA (R$ 3,00) ---
  const DELIVERY_FEE = 3;
  realTotal += DELIVERY_FEE;

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      address: data.address,
      paymentMethod: data.paymentMethod,
      changeFor: data.changeFor,
      total: realTotal, // Usa o total seguro calculado acima, com taxa
      status: "PENDENTE",
      items: {
        create: secureCart,
      },
    },
  });

  return { orderId: order.id };
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  await verifyAdmin();
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
    await verifyAdmin();
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
