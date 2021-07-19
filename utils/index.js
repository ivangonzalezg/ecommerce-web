const formatToCurrency = number => {
  return Number(Math.ceil(Number(number) * 100) / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
};

const getProductSalePrice = (product = { price: 0, discount: 0 }) => {
  let salePrice = product.price;

  if (product.discount > 0) {
    salePrice = product.price * (1 - product.discount / 100);
  }

  return salePrice;
};

export { formatToCurrency, getProductSalePrice };
