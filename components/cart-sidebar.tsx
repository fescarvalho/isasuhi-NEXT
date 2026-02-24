"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import {
  X,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { createOrder } from "@/app/actions";
import Image from "next/image";

export function CartSidebar() {
  const {
    cart,
    isCartOpen,
    toggleCart,

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

  const formattedTotal = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(total());

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
      const shortId = result.orderId.slice(-4).toUpperCase();
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

      // SOLUÇÃO PARA IPHONE: Redirecionamento na mesma aba evita bloqueio de pop-up
      window.location.href = whatsappUrl;

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

  const copyPix = () => {
    navigator.clipboard.writeText("22998184401");
    alert("Chave Pix Copiada!");
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCart}
      />

      <div className="relative w-full h-[100dvh] md:w-[450px] bg-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* HEADER */}
        <div className="flex-none bg-white text-gray-800 border-b border-gray-100 z-10">
          <div className="flex justify-between items-center p-5">
            <h2 className="font-black text-2xl uppercase italic tracking-tighter text-sushi-red">
              {step === 1 ? "Sua Sacola" : step === 2 ? "Entrega" : "Pagamento"}
            </h2>
            <button
              onClick={toggleCart}
              className="text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X size={28} strokeWidth={3} />
            </button>
          </div>

          <div className="flex px-5 pb-4 gap-2">
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-sushi-red" : "bg-gray-100"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-sushi-red" : "bg-gray-100"}`}
            />
            <div
              className={`h-1.5 flex-1 rounded-full ${step >= 3 ? "bg-sushi-red" : "bg-gray-100"}`}
            />
          </div>
        </div>

        {/* CONTEÚDO ROLÁVEL */}
        <div className="flex-1 overflow-y-auto bg-white p-5 custom-scrollbar">
          {/* PASSO 1: LISTA */}
          {step === 1 && (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100"
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded-xl relative overflow-hidden border border-gray-200">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-300">
                        <ShoppingBag />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-800 text-base leading-tight line-clamp-2 uppercase">
                      {item.name}
                    </h4>
                    <p className="font-black text-sushi-red text-lg mt-1">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, "increase")}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full font-black text-green-600 shadow-sm"
                    >
                      +
                    </button>
                    <span className="font-black text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, "decrease")}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full font-black text-red-600 shadow-sm"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PASSO 2: ENDEREÇO (RUA MAIOR QUE BAIRRO) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Seus Dados
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl font-black text-lg outline-none focus:border-sushi-red"
                  placeholder="NOME COMPLETO"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl font-black text-lg outline-none focus:border-sushi-red"
                  placeholder="WHATSAPP"
                />
              </div>

              <div className="space-y-4 border-t pt-6">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">
                  Onde Entregar
                </label>
                <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-4">
                    <input
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full border-2 border-gray-100 p-4 rounded-xl font-black text-lg outline-none focus:border-sushi-red"
                      placeholder="RUA"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="w-full border-2 border-gray-100 p-4 rounded-xl font-black text-lg outline-none focus:border-sushi-red text-center"
                      placeholder="Nº"
                    />
                  </div>
                </div>

                <input
                  value={address.neighborhood}
                  onChange={(e) =>
                    setAddress({ ...address, neighborhood: e.target.value })
                  }
                  className="w-full border-2 border-gray-100 p-4 rounded-xl font-black text-lg outline-none focus:border-sushi-red"
                  placeholder="BAIRRO"
                />

                <input
                  value={address.complement}
                  onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                  className="w-full border-2 border-gray-100 p-4 rounded-xl font-black text-lg outline-none focus:border-sushi-red"
                  placeholder="COMPLEMENTO (OPCIONAL)"
                />
              </div>
            </div>
          )}

          {/* PASSO 3: PAGAMENTO (PIX COM QR CODE) */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 gap-3">
                {["PIX", "Dinheiro", "Cartão"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-5 border-2 rounded-2xl flex items-center justify-between transition-all ${paymentMethod === method ? "border-sushi-red bg-red-50 text-sushi-red font-black" : "border-gray-100 text-gray-400 font-bold"}`}
                  >
                    <span className="uppercase tracking-widest">{method}</span>
                    {paymentMethod === method && <CheckCircle2 size={20} />}
                  </button>
                ))}
              </div>

              {paymentMethod === "PIX" && (
                <div className="bg-gray-50 p-8 rounded-[32px] border-2 border-dashed border-gray-200 text-center animate-in zoom-in-95 duration-300">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                    Copie a chave Pix abaixo:
                  </p>

                  <div className="bg-white border-2 border-gray-200 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                    <span className="text-lg font-black text-gray-800 break-all leading-tight">
                      22998184401
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("22998184401");
                        alert("✅ Chave Pix Copiada!");
                      }}
                      className="w-full bg-gray-900 text-white p-4 rounded-xl flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-lg"
                    >
                      <span className="font-black text-xs uppercase tracking-widest">
                        Copiar Chave
                      </span>
                      <Copy size={20} strokeWidth={3} />
                    </button>
                  </div>

                  <p className="text-[10px] text-red-500 font-black mt-6 uppercase tracking-tighter italic leading-relaxed">
                    ⚠️ O seu pedido só será iniciado após
                    <br />o envio do comprovante no WhatsApp
                  </p>
                </div>
              )}

              {paymentMethod === "Dinheiro" && (
                <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
                  <label className="text-[10px] font-black text-yellow-800 uppercase block mb-2 tracking-widest">
                    Troco para quanto?
                  </label>
                  <input
                    type="number"
                    value={changeFor}
                    onChange={(e) => setChangeFor(e.target.value)}
                    className="w-full p-4 border-2 border-yellow-200 rounded-xl font-black text-lg outline-none focus:border-yellow-500"
                    placeholder="R$ 0,00"
                  />
                  {Number(changeFor) > 0 && Number(changeFor) < total() && (
                    <p className="text-red-500 text-[10px] font-black mt-2 uppercase">
                      ⚠️ Valor menor que o total
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER FIXO */}
        <div className="flex-none p-6 bg-white border-t border-gray-100 shadow-[0_-10px_25px_rgba(0,0,0,0.05)] pb-[calc(20px+env(safe-area-inset-bottom))]">
          <div className="flex justify-between items-end mb-6 px-1">
            <span className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
              Total do Pedido
            </span>
            <span className="text-3xl font-black text-gray-900 tracking-tighter">
              {formattedTotal}
            </span>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-5 rounded-2xl border-2 border-gray-100 text-gray-400 hover:bg-gray-50"
              >
                <ChevronLeft size={28} strokeWidth={3} />
              </button>
            )}

            <button
              disabled={
                loading ||
                cart.length === 0 ||
                (paymentMethod === "Dinheiro" && Number(changeFor) < total())
              }
              onClick={step < 3 ? () => setStep(step + 1) : handleFinishOrder}
              className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 ${
                step === 3 ? "bg-green-600 text-white" : "bg-sushi-red text-white"
              } disabled:opacity-50`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {step === 1 && "Continuar"}
                  {step === 2 && "Pagamento"}
                  {step === 3 && "Finalizar no Zap"}
                  {step < 3 && <ChevronRight size={20} strokeWidth={3} />}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
