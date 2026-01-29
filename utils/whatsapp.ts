import { CartItem } from "@/store/cart-store";

export function generateWhatsAppLink(
  cart: CartItem[], 
  total: number, 
  paymentMethod: string, 
  changeValue?: string
) {
  const phone = "5522998184401"; // Seu número
  
  let message = `*NOVO PEDIDO - ISA SUSHI* 🍣\n\n`;
  
  message += `*ITENS DO PEDIDO:*\n`;
  cart.forEach((item) => {
    message += `▪️ ${item.quantity}x ${item.name}\n`;
    // Verifica se tem observação (opcional, se você adicionar esse campo depois)
    if (item.observation) message += `   Obs: ${item.observation}\n`;
    message += `   R$ ${(item.price * item.quantity).toFixed(2)}\n`;
  });

  message += `\n*TOTAL: R$ ${total.toFixed(2)}*\n`;
  message += `------------------------------\n`;
  message += `*Forma de Pagamento:* ${paymentMethod}\n`;
  
  if (paymentMethod === 'Dinheiro' && changeValue) {
    message += `*Troco para:* R$ ${changeValue}\n`;
  }

  message += `\nAguardo a confirmação e o tempo de entrega!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}