import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import styles from "../styles/product.module.css";
import { getPhotoUrl } from "../api";

export default function Product(props) {
  return (
    <div className={styles.product}>
      <div className={styles.container}>
        <div className={styles.image_container}>
          <Image
            className={styles.image}
            loader={getPhotoUrl(props?.image?.url)}
            src="/images/placeholder-image.png"
            width={250}
            height={250}
          />
        </div>
        <div className={styles.body_container}>
          <h3 className={styles.name}>{props.name}</h3>
          <span className={styles.pieces}> {props.quantity} pc(s)</span>
          <div className={styles.footer}>
            <span className={styles.price}>${props.price}</span>
            <button className={styles.cart_button}>
              <Image className={styles.cart} src="/images/cart.png" width={12} height={12} />
              <span>Carrito</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

Product.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired
};
