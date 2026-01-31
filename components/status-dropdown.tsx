"use client";
import { updateOrderStatus } from "@/app/actions";

export function StatusDropdown({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  return (
    <select
      defaultValue={currentStatus}
      onChange={(e) => updateOrderStatus(orderId, e.target.value)}
      className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase bg-gray-100 border-none"
    >
      <option value="PEDIDO_REALIZADO">Realizado</option>
      <option value="SAIU_PARA_ENTREGA">Saiu para Entrega</option>
      <option value="ENTREGUE">Entregue</option>
    </select>
  );
}
