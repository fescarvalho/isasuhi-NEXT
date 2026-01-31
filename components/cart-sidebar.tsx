"use client";

import { useState, useEffect } from "react";
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

  // Trava o scroll da página principal ao abrir o carrinho
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

      // 1. Cria o pedido no banco e recebe o resultado (que contém o orderId)
      const result = await createOrder({
        customerName: name,
        customerPhone: phone,
        address: fullAddress,
        paymentMethod,
        changeFor: paymentMethod === "Dinheiro" ? changeFor : "",
        cart,
        total: total(),
      });

      // 2. Monta as variáveis para a mensagem
      const storePhone = "5522981573795";
      const shortId = result.orderId.slice(-4);

      // Captura a URL do seu site dinamicamente
      const siteUrl = window.location.origin;
      const trackingLink = `${siteUrl}/pedido/${result.orderId}`;

      const itemsList = cart.map((item) => `${item.quantity}x ${item.name}`).join("\n");

      // 3. Monta a mensagem completa com o link de acompanhamento
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

      // 4. Abre o WhatsApp e limpa o carrinho
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
    <div className="fixed inset-0 z-[999] flex justify-end overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={toggleCart}
      />

      <div className="relative w-full max-w-md bg-white h-screen flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* HEADER FIXO */}
        <div className="flex-none bg-sushi-red text-white">
          <div className="flex justify-between items-center p-5 shadow-md relative">
            <h2 className="font-extrabold text-xl font-display tracking-tight">
              Seu Pedido
            </h2>
            <button
              onClick={toggleCart}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="flex text-[11px] font-black bg-sushi-darkRed/20 uppercase tracking-widest">
            <div
              className={`flex-1 p-3 text-center flex flex-col items-center gap-1 ${step === 1 ? "bg-white text-sushi-red" : "opacity-70 text-white"}`}
            >
              <ShoppingBag size={16} /> Sacola
            </div>
            <div
              className={`flex-1 p-3 text-center flex flex-col items-center gap-1 ${step === 2 ? "bg-white text-sushi-red" : "opacity-70 text-white"}`}
            >
              <MapPin size={16} /> Endereço
            </div>
            <div
              className={`flex-1 p-3 text-center flex flex-col items-center gap-1 ${step === 3 ? "bg-white text-sushi-red" : "opacity-70 text-white"}`}
            >
              <Banknote size={16} /> Pagamento
            </div>
          </div>
        </div>

        {/* CONTEÚDO ROLÁVEL (Onde fica o formulário) */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 custom-scrollbar">
          {/* PASSO 1: ITENS DA SACOLA */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center"
                >
                  <div className="flex flex-col items-center justify-between bg-gray-50 rounded-lg border px-2 py-1 h-20">
                    <button
                      onClick={() => updateQuantity(item.id, "increase")}
                      className="text-green-600 font-black text-xl"
                    >
                      +
                    </button>
                    <span className="text-sm font-black">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, "decrease")}
                      className="text-red-600 font-black text-xl"
                    >
                      -
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-gray-800 leading-tight mb-1">
                      {item.name}
                    </h4>
                    <p className="font-black text-sushi-red text-base">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(item.price * item.quantity)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 p-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PASSO 2: FORMULÁRIO DE CHECKOUT (RESTAURADO) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in flex flex-col">
              {/* Bloco de Dados Pessoais */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                    Seu Nome Completo
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl text-lg font-bold outline-none focus:border-sushi-red transition-all placeholder:font-medium"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                    WhatsApp para Contato
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl text-lg font-bold outline-none focus:border-sushi-red transition-all placeholder:font-medium"
                    placeholder="(22) 99999-9999"
                  />
                </div>
              </div>

              {/* Bloco de Endereço com Rua maior que o Número */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                <div className="col-span-3">
                  {" "}
                  {/* Rua ocupa 75% do espaço */}
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                    Rua
                  </label>
                  <input
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full border-2 border-gray-100 p-4 rounded-xl text-lg font-bold outline-none focus:border-sushi-red transition-all"
                    placeholder="Nome da rua"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                      Bairro
                    </label>
                    <input
                      value={address.neighborhood}
                      onChange={(e) =>
                        setAddress({ ...address, neighborhood: e.target.value })
                      }
                      className="w-full border-2 border-gray-100 p-4 rounded-xl text-lg font-bold outline-none focus:border-sushi-red transition-all"
                      placeholder="Ex: Centro"
                    />
                  </div>
                  <div className="col-span-1">
                    {" "}
                    {/* Número ocupa 25% do espaço */}
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block text-center">
                      Nº
                    </label>
                    <input
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      className="w-full border-2 border-gray-100 p-4 rounded-xl text-lg font-bold outline-none focus:border-sushi-red transition-all text-center"
                      placeholder="123"
                    />
                  </div>
                </div>

                <div></div>

                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                    Complemento (Opcional)
                  </label>
                  <input
                    value={address.complement}
                    onChange={(e) =>
                      setAddress({ ...address, complement: e.target.value })
                    }
                    className="w-full border-2 border-gray-100 p-4 rounded-xl text-lg font-bold outline-none focus:border-sushi-red transition-all font-medium"
                    placeholder="Apto, Bloco, Referência..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 3: PAGAMENTO (Sendo renderizado dentro da div flex-1) */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-black mb-5 flex items-center gap-2 text-gray-800">
                  <Banknote size={24} className="text-green-600" /> Forma de Pagamento
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {["PIX", "Dinheiro", "Cartão"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 border-2 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${paymentMethod === method ? "bg-red-50 border-sushi-red text-sushi-red shadow-md" : "bg-gray-50 border-gray-100 text-gray-400"}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {/* CAMPO DE TROCO RESTAURADO */}
                {paymentMethod === "Dinheiro" && (
                  <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">
                      Troco para quanto?
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400 text-lg">
                        R$
                      </span>
                      <input
                        type="number"
                        value={changeFor}
                        onChange={(e) => setChangeFor(e.target.value)}
                        className={`w-full border-2 p-4 pl-12 rounded-xl text-lg font-black outline-none transition-all ${Number(changeFor) > 0 && Number(changeFor) < total() ? "border-red-500 bg-red-50 text-red-600" : "border-gray-100 focus:border-sushi-red"}`}
                        placeholder="0,00"
                      />
                    </div>
                    {Number(changeFor) > 0 && Number(changeFor) < total() && (
                      <p className="text-red-500 text-xs font-black mt-2 uppercase tracking-tighter">
                        ⚠️ O valor deve ser maior que o total ({formattedTotal})
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER FIXO NA BASE */}
        <div className="flex-none p-6 bg-white border-t shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
          <div className="flex justify-between items-center mb-6 px-1">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Total do Pedido:
            </span>
            <span className="text-2xl font-black text-sushi-red">{formattedTotal}</span>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="p-4 rounded-2xl border-2 border-gray-100 text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <button
              disabled={cart.length === 0}
              onClick={step < 3 ? () => setStep(step + 1) : handleFinishOrder}
              className={`flex-1 p-5 rounded-2xl font-black uppercase text-sm tracking-widest flex justify-center items-center gap-2 shadow-xl active:scale-95 transition-all ${
                step === 3
                  ? "bg-green-600 hover:bg-green-700 shadow-green-200"
                  : "bg-sushi-red hover:bg-red-700 shadow-red-200"
              } text-white`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  {step < 3 ? "Continuar" : "Enviar Pedido no Zap"}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
