"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import {
  X,
  ShoppingBag,
  MapPin,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { createOrder } from "@/app/actions";

export function CartSidebar() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    total,
    clearCart,
  } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);


  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [changeFor, setChangeFor] = useState("");

  if (!isCartOpen) return null;

  const handleFinishOrder = async () => {
    setLoading(true);

    // --- VALIDAÇÃO DO TROCO ---
    if (paymentMethod === "Dinheiro") {
      const trocoValue = Number(changeFor);
      const totalValue = total();

      if (!changeFor || trocoValue < totalValue) {
        alert(
          `O valor para troco (R$ ${trocoValue.toFixed(2)}) não pode ser menor que o total do pedido (R$ ${totalValue.toFixed(2)})!`,
        );
        setLoading(false);
        return;
      }
    }

    try {
      const fullAddress = `${address.street}, ${address.number} - ${address.neighborhood} ${address.complement ? `(${address.complement})` : ""}`;

     
      const result = await createOrder({
        customerName: name,
        customerPhone: phone,
        address: fullAddress,
        paymentMethod,
        changeFor,
        cart,
        total: total(),
      });


      const storePhone = "5522981573795";
      const siteUrl = window.location.origin;
      const trackingLink = `${siteUrl}/pedido/${result.orderId}`;

      const message = `*NOVO PEDIDO REALIZADO* 🍣
ID: #${result.orderId.slice(-4)}

${cart.map((item) => `${item.quantity}x ${item.name}`).join("\n")}

*Total: ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(total())}*
--------------------------------
*DADOS DO CLIENTE:*
👤 ${name}
📱 ${phone}
📍 ${fullAddress}
💰 Pagamento: ${paymentMethod} ${changeFor ? `(Troco p/ ${changeFor})` : ""}
--------------------------------

*Link para acompanhar o pedido:*
${trackingLink}`;

    
      const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

     
      clearCart();
      toggleCart();
      setStep(1);
      setName("");
      setChangeFor("");
    } catch (error) {

      const message = error instanceof Error ? error.message : "Erro desconhecido";
      if (message.includes("LOJA_FECHADA")) {
        alert(
          "⛔ A LOJA ESTÁ FECHADA!\n\nNo momento não estamos aceitando novos pedidos. Tente novamente mais tarde.",
        );
      } else {
        console.error("Erro ao processar pedido:", error);
        alert("Erro ao processar pedido. Verifique os dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total());

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleCart}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* HEADER */}
        <div className="bg-sushi-red text-white">
          <div className="flex justify-between items-center p-4 shadow-md z-10 relative">
            <h2 className="font-bold text-lg font-display">Seu Pedido</h2>
            <button onClick={toggleCart} className="hover:bg-white/20 p-1 rounded-full">
              <X />
            </button>
          </div>
          {/* Abas */}
          <div className="flex text-xs font-medium bg-sushi-darkRed/20">
            <div
              className={`flex-1 p-3 text-center flex flex-col items-center gap-1 transition-colors ${step === 1 ? "bg-white text-sushi-red font-bold" : "opacity-70 text-white"}`}
            >
              <ShoppingBag size={18} /> Sacola
            </div>
            <div
              className={`flex-1 p-3 text-center flex flex-col items-center gap-1 transition-colors ${step === 2 ? "bg-white text-sushi-red font-bold" : "opacity-70 text-white"}`}
            >
              <MapPin size={18} /> Checkout
            </div>
            <div
              className={`flex-1 p-3 text-center flex flex-col items-center gap-1 transition-colors ${step === 3 ? "bg-white text-sushi-red font-bold" : "opacity-70 text-white"}`}
            >
              <Banknote size={18} /> Pagamento
            </div>
          </div>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {/* PASSO 1: SACOLA */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in flex flex-col h-full">
              <div className="flex-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10 flex flex-col items-center">
                    <ShoppingBag size={48} className="text-gray-300 mb-2" />
                    <p>Sua sacola está vazia.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3"
                    >
                      <div className="flex flex-col items-center justify-between bg-gray-50 rounded border px-1 py-1 h-20">
                        <button
                          onClick={() => updateQuantity(item.id, "increase")}
                          className="text-green-600 hover:bg-green-100 rounded"
                        >
                          +
                        </button>
                        <span className="text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, "decrease")}
                          className="text-red-600 hover:bg-red-100 rounded"
                        >
                          -
                        </button>
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800 line-clamp-2">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-[10px] text-gray-400 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <p className="font-bold text-sushi-red text-sm">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 self-start"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* TOTAL NA SACOLA */}
              {cart.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                  <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Total do Pedido:</span>
                    <span className="text-sushi-red">{formattedTotal}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSO 2: ENDEREÇO */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    SEU NOME
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    WHATSAPP
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                    placeholder="(22) 99999-9999"
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                      RUA
                    </label>
                    <input
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">
                      NÚMERO
                    </label>
                    <input
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    BAIRRO
                  </label>
                  <input
                    value={address.neighborhood}
                    onChange={(e) =>
                      setAddress({ ...address, neighborhood: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                    placeholder="Centro"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">
                    COMPLEMENTO
                  </label>
                  <input
                    value={address.complement}
                    onChange={(e) =>
                      setAddress({ ...address, complement: e.target.value })
                    }
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                    placeholder="Apto 101..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: PAGAMENTO */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Banknote size={20} className="text-green-600" /> Como deseja pagar?
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {["PIX", "Dinheiro", "Cartão Crédito", "Cartão Débito"].map(
                    (method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-3 border rounded-lg text-sm font-medium transition-all ${paymentMethod === method ? "bg-red-50 border-sushi-red text-sushi-red ring-1 ring-sushi-red" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"}`}
                      >
                        {method}
                      </button>
                    ),
                  )}
                </div>

                {paymentMethod === "Dinheiro" && (
                  <div className="mt-4 animate-in fade-in bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <label className="text-xs font-bold text-yellow-800 mb-1 block">
                      TROCO PARA QUANTO?
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                        R$
                      </span>
                      <input
                        type="number"
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        className={`w-full border pl-10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red transition-all ${Number(changeFor) > 0 && Number(changeFor) < total() ? "border-red-500 text-red-600" : "border-gray-300"}`}
                        placeholder={total().toFixed(2)}
                      />
                    </div>
                    {Number(changeFor) > 0 && Number(changeFor) < total() && (
                      <p className="text-xs text-red-500 mt-1 font-bold">
                        Valor menor que o total ({formattedTotal})
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gray-100 p-4 rounded-xl text-sm space-y-2 border border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span> <span>{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Entrega:</span> <span>Grátis</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300 text-gray-800">
                  <span>Total:</span>
                  <span>{formattedTotal}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} /> Voltar
              </button>
            )}

            {step < 3 ? (
              <button
                disabled={cart.length === 0}
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-sushi-red text-white py-3 rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all shadow-lg shadow-red-200"
              >
                Continuar <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleFinishOrder}
                disabled={
                  loading ||
                  !name ||
                  !phone ||
                  !address.street ||
                  (paymentMethod === "Dinheiro" && Number(changeFor) < total())
                }
                className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold hover:bg-[#128C7E] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all shadow-lg"
              >
                {loading ? <Loader2 className="animate-spin" /> : "ENVIAR PEDIDO NO ZAP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
