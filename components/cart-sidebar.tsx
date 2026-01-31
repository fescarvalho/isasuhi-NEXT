"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { X, ShoppingBag, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { createOrder } from "@/app/actions";
import Image from "next/image";

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
  const [changeFor, setChangeFor] = useState("");

  // Estados do Formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("PIX");

  // Trava a rolagem da página de trás
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const handleFinishOrder = async () => {
    setLoading(true);

    try {
      const fullAddress = `${address.street}, ${address.number} - ${address.neighborhood}${address.complement ? ` (${address.complement})` : ""}`;

      const result = await createOrder({
        customerName: name,
        customerPhone: phone,
        address: fullAddress,
        paymentMethod,
        changeFor: paymentMethod === "Dinheiro" ? changeFor : "",
        cart,
        total: total(),
      });

      const storePhone = "5522981573795";
      const shortId = result.orderId.slice(-4);
      const siteUrl = window.location.origin;
      const trackingLink = `${siteUrl}/pedido/${result.orderId}`;
      const itemsList = cart.map((item) => `${item.quantity}x ${item.name}`).join("\n");

      const message = `*NOVO PEDIDO REALIZADO* 🍣
ID: #${shortId}

${itemsList}

*Total: ${formattedTotal}*
--------------------------------
*DADOS DO CLIENTE:*
👤 ${name}
📱 ${phone}
📍 ${fullAddress}
💰 Pagamento: ${paymentMethod}${changeFor ? ` (Troco p/ ${changeFor})` : ""}
--------------------------------

*Link para acompanhar o seu pedido:*
${trackingLink}`;

      const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
      clearCart();
      toggleCart();
      setStep(1);
    } catch (error) {
      console.error(error);
      alert("Erro ao processar pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total());

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      {/* Overlay Escuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Sidebar Container */}
      {/* CORREÇÃO AQUI: h-[100dvh] garante altura correta no mobile sem esconder o botão */}
      <div className="relative w-full h-[100dvh] md:w-[450px] md:h-screen bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 md:rounded-l-2xl">
        {/* HEADER */}
        <div className="flex-none bg-white text-gray-800 border-b border-gray-100 z-10">
          <div className="flex justify-between items-center p-4 md:p-5">
            <h2 className="font-bold text-lg text-gray-800">
              {step === 1 ? "Sacola" : step === 2 ? "Entrega" : "Pagamento"}
            </h2>
            <button
              onClick={toggleCart}
              className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Barra de Progresso */}
          <div className="flex px-5 pb-2 gap-2">
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? "bg-sushi-red" : "bg-gray-100"}`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? "bg-sushi-red" : "bg-gray-100"}`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 3 ? "bg-sushi-red" : "bg-gray-100"}`}
            />
          </div>
        </div>

        {/* CONTEÚDO ROLÁVEL (Meio da tela) */}
        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar pb-4">
          {/* PASSO 1: LISTA */}
          {step === 1 && (
            <div className="divide-y divide-gray-50">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex gap-3 md:gap-4 items-start hover:bg-gray-50 transition-colors"
                >
                  {/* Foto Quadrada */}
                  <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg bg-gray-100 relative overflow-hidden border border-gray-200">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <ShoppingBag size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-h-[64px] md:min-h-[80px]">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                      <span className="font-bold text-gray-900 text-sm md:text-base">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(item.price)}
                      </span>

                      {/* Controlador de Quantidade */}
                      <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm h-8 md:h-9">
                        <button
                          onClick={() => updateQuantity(item.id, "decrease")}
                          className="px-2 md:px-3 text-red-600 font-bold hover:bg-red-50 h-full rounded-l-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold w-6 md:w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, "increase")}
                          className="px-2 md:px-3 text-red-600 font-bold hover:bg-red-50 h-full rounded-r-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>Sua sacola está vazia.</p>
                </div>
              )}
            </div>
          )}

          {/* PASSO 2: DADOS */}
          {step === 2 && (
            <div className="p-5 space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Seus Dados
                </h3>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-400"
                  placeholder="Seu Nome"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-400"
                  placeholder="Seu WhatsApp"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                  Endereço
                </h3>
                <input
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-red-500 transition-all"
                  placeholder="Rua"
                />
                <div className="grid grid-cols-4 gap-3">
                  <input
                    value={address.neighborhood}
                    onChange={(e) =>
                      setAddress({ ...address, neighborhood: e.target.value })
                    }
                    className="col-span-3 w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-red-500 transition-all"
                    placeholder="Bairro"
                  />
                  <input
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    className="col-span-1 w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-red-500 transition-all text-center"
                    placeholder="Nº"
                  />
                </div>
                <input
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  className="w-full border border-gray-200 p-3 rounded-lg outline-none focus:border-red-500 transition-all"
                  placeholder="Complemento (Opcional)"
                />
              </div>
            </div>
          )}

          {/* PASSO 3: PAGAMENTO */}
          {step === 3 && (
            <div className="p-5 space-y-6">
              <h3 className="font-bold text-gray-800">Como deseja pagar?</h3>
              <div className="grid grid-cols-1 gap-3">
                {["PIX", "Dinheiro", "Cartão"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-4 border rounded-xl flex items-center justify-between transition-all ${paymentMethod === method ? "border-red-500 bg-red-50 text-red-700 font-bold shadow-sm" : "border-gray-200 hover:border-red-200 hover:bg-gray-50"}`}
                  >
                    <span>{method}</span>
                    {paymentMethod === method && (
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                    )}
                  </button>
                ))}
              </div>

              {paymentMethod === "Dinheiro" && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 animate-in fade-in">
                  <label className="text-sm font-bold text-yellow-800 block mb-2">
                    Troco para quanto?
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      R$
                    </span>
                    <input
                      type="number"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      className="w-full pl-10 p-3 border border-yellow-200 rounded-lg focus:border-yellow-500 outline-none bg-white"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER FIXO (Rodapé) */}
        {/* Usamos safe-area-bottom para garantir que não cole na borda do iPhone */}
        <div className="flex-none p-5 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 pb-[calc(20px+env(safe-area-inset-bottom))]">
          <div className="flex justify-between items-end mb-4">
            <span className="text-gray-500 text-sm font-medium">Total do Pedido</span>
            <span className="text-2xl font-black text-gray-900">{formattedTotal}</span>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 rounded-xl border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <button
              disabled={cart.length === 0}
              onClick={step < 3 ? () => setStep(step + 1) : handleFinishOrder}
              className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all ${
                step === 3
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
                  : "bg-sushi-red text-white hover:bg-red-700 shadow-red-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {step === 1 && "Continuar"}
                  {step === 2 && "Ir para Pagamento"}
                  {step === 3 && "Finalizar Pedido"}
                  {step < 3 && <ChevronRight size={20} />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
