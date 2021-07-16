import React, { useContext } from "react";
import { LocalMall } from "@material-ui/icons";
import styles from "../styles/components/cart.module.css";
import { CartContext } from "../contexts/cart";
import { formatToCurrency, getProductSalePrice } from "../utils";

export default function Cart() {
  const { products } = useContext(CartContext);

  const total = products.reduce((total, item) => total + getProductSalePrice(item.product) * item.quantity, 0);

  return (
    <button className={styles.cart}>
      <div className={styles.items_container}>
        <LocalMall fontSize="small" />
        <span className={styles.items_text}>{products.length} items</span>
      </div>
      <br />
      <div className={styles.total_container}>{formatToCurrency(total)}</div>
    </button>
  );
}
