"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { X, Trash2, Minus, Plus, ShoppingBag, Banknote } from "lucide-react";

export function CartSidebar() {
  const { 
    cart, 
    isCartOpen, 
    toggleCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    total 
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [changeFor, setChangeFor] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (paymentMethod === 'Dinheiro' && changeFor && Number(changeFor) < total()) {
      alert('O valor para troco deve ser maior que o total do pedido!');
      return;
    }

    const link = generateWhatsAppLink(cart, total(), paymentMethod, changeFor);
    window.open(link, '_blank');
  };

  const handleClearCart = () => {
    if (confirm("Tem certeza que deseja esvaziar todo o carrinho?")) {
      clearCart();
    }
  };

  const priceFormat = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Cabeçalho */}
        <div className="p-4 bg-sushi-red text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold font-display">Seu Pedido</h2>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button 
                onClick={handleClearCart}
                className="p-2 hover:bg-white/20 rounded-full transition text-red-100 hover:text-white"
                title="Esvaziar carrinho"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={toggleCart} className="p-2 hover:bg-white/20 rounded-full transition">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <p>Seu carrinho está vazio 😔</p>
                <button onClick={toggleCart} className="mt-4 text-sushi-red font-bold hover:underline">
                  Voltar ao cardápio
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex gap-3">
                  <div className="flex flex-col items-center justify-between bg-gray-50 rounded-md w-8 py-1 border">
                    <button onClick={() => updateQuantity(item.id, 'increase')} className="text-green-600 hover:bg-green-100 p-1 rounded"><Plus size={14} /></button>
                    <span className="text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 'decrease')} className="text-red-500 hover:bg-red-100 p-1 rounded"><Minus size={14} /></button>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 line-clamp-2">{item.name}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    <div className="mt-2 font-bold text-sushi-red">{priceFormat.format(item.price * item.quantity)}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagamento */}
          {cart.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Banknote size={20} className="text-green-600"/> Forma de Pagamento
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {['PIX', 'Dinheiro', 'Cartão Crédito', 'Cartão Débito'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2 rounded-lg text-sm font-medium border transition-all ${
                      paymentMethod === method 
                        ? 'bg-red-50 border-sushi-red text-sushi-red ring-1 ring-sushi-red' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {paymentMethod === 'Dinheiro' && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm text-gray-600 mb-1">Troco para quanto?</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                    <input 
                      type="number" 
                      placeholder="Ex: 50,00"
                      className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sushi-red/20 focus:border-sushi-red"
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rodapé Fixo */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-200 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Total:</span>
              <span className="text-2xl font-bold text-sushi-darkRed">
                {priceFormat.format(total())}
              </span>
            </div>
            
            {/* --- MUDAMOS AQUI: Botão com Ícone do WhatsApp --- */}
            <button
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-3 active:scale-95"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Enviar Pedido no Zap</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}