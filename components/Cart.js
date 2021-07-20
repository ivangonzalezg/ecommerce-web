import React, { useContext } from "react";
import { LocalMall, Close } from "@material-ui/icons";
import classNames from "classnames";
import Image from "next/image";
import styles from "../styles/components/cart.module.css";
import { CartContext } from "../contexts/cart";
import { StateContext } from "../contexts/state";
import { formatToCurrency, getProductSalePrice } from "../utils";
import CartItem from "./CartItem";

export default function Cart() {
  const { items, isCartSidebar, updateIsCartSidebar, isAdding } = useContext(CartContext);
  const { isLoggedIn } = useContext(StateContext);

  if (!isLoggedIn) {
    return null;
  }

  const total = items.reduce((total, item) => total + getProductSalePrice(item.product) * item.quantity, 0);

  const numberOfItems = `${items.length} ${items.length === 1 ? "item" : "items"}`;

  const toggleSidebar = () => updateIsCartSidebar(!isCartSidebar);

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
          [styles.sidebar_open]: isCartSidebar
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
        <div className={styles.sidebar_body}>
          {items.length > 0 ? (
            items.map(item => <CartItem key={item.id} {...item} />)
          ) : (
            <div className={styles.cart_empty_container}>
              <Image src="/images/cart_empty.svg" width={140} height={180} objectFit="contain" alt="cart empty" />
              <span className={styles.cart_empty_text}>No se encontraron productos</span>
            </div>
          )}
        </div>
        <div className={styles.sidebar_footer}>
          <button className={styles.checkout_button} disabled={isAdding || !total}>
            <span>Checkout</span>
            <div className={styles.checkout_button_total}>{formatToCurrency(total)}</div>
          </button>
        </div>
      </div>
    </>
  );
}
