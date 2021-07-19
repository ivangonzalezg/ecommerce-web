import React, { useContext, useState } from "react";
import { LocalMall, Close } from "@material-ui/icons";
import classNames from "classnames";
import styles from "../styles/components/cart.module.css";
import { CartContext } from "../contexts/cart";
import { StateContext } from "../contexts/state";
import { formatToCurrency, getProductSalePrice } from "../utils";

export default function Cart() {
  const { items } = useContext(CartContext);
  const { isLoggedIn } = useContext(StateContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) {
    return null;
  }

  const total = items.reduce((total, item) => total + getProductSalePrice(item.product) * item.quantity, 0);

  const numberOfItems = `${items.length} ${items.length === 1 ? "item" : "items"}`;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <button className={styles.cart} onClick={toggleSidebar}>
        <div className={styles.items_container}>
          <LocalMall fontSize="small" />
          <span className={styles.items_text}>{numberOfItems}</span>
        </div>
        <br />
        <div className={styles.total_container}>{formatToCurrency(total)}</div>
      </button>
      <div
        className={classNames(styles.sidebar, {
          [styles.sidebar_open]: isSidebarOpen
        })}
      >
        <div className={styles.sidebar_header}>
          <div className={styles.sidebar_items_container}>
            <LocalMall />
            <span className={styles.items_text}>{numberOfItems}</span>
          </div>
          <button className={styles.sidebar_close_button} onClick={toggleSidebar}>
            <Close fontSize="inherit" />
          </button>
        </div>
        <div className={styles.sidebar_body}></div>
        <div className={styles.sidebar_footer}>
          <button className={styles.checkout_button}>
            <span>Checkout</span>
            <div className={styles.checkout_button_total}>{formatToCurrency(total)}</div>
          </button>
        </div>
      </div>
    </>
  );
}
