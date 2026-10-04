const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;

export function calcPrices(items) {
  const itemsPrice = round2(items.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}
