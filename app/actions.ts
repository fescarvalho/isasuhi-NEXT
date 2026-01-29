// app/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// SALVAR PRODUTO (Cria ou Atualiza)
export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const categoryId = formData.get("categoryId") as string;
  const imageUrl = formData.get("imageUrl") as string; // Opcional

  if (id) {
    // Editar existente
    await prisma.product.update({
      where: { id },
      data: { name, description, price, categoryId, imageUrl },
    });
  } else {
    // Criar novo
    await prisma.product.create({
      data: { name, description, price, categoryId, imageUrl },
    });
  }

  // Atualiza as páginas para mostrar os dados novos
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// DELETAR PRODUTO
export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  
  await prisma.product.delete({ where: { id } });
  
  revalidatePath("/");
  revalidatePath("/admin");
}