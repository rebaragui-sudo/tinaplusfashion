// Configuração de combos por produto
// chave: product id, valor: { quantity, price }
export const PRODUCT_COMBOS: Record<string, { quantity: number; price: number }> = {
  '0added14-1886-47bd-bf38-f007a2af10db': { quantity: 3, price: 100 }, // casaco teddy botão unico
};

export const getProductCombo = (productId: string) => {
  return PRODUCT_COMBOS[productId] || null;
};
