import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import styles from "../styles/components/product.module.css";
import { getPhotoUrl } from "../api";

export default function Product(props) {
  const { image, name, quantity, price, discount } = props;

  let salePrice = price;

  if (discount > 0) {
    salePrice = price * (1 - discount / 100);
  }

  return (
    <div className={styles.product}>
      <div className={styles.container}>
        <div className={styles.image_container}>
          <Image
            className={styles.image}
            loader={getPhotoUrl(image?.url)}
            src="/images/placeholder-image.png"
            width={250}
            height={250}
          />
        </div>
        <div className={styles.body_container}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.pieces}> {quantity} pc(s)</span>
          <div className={styles.footer}>
            {discount > 0 && <span className={styles.price_discount}>${price}</span>}
            <span className={styles.price}>${salePrice}</span>
            <button className={styles.cart_button}>
              <Image className={styles.cart} src="/images/cart.png" width={12} height={12} />
              <span>Carrito</span>
            </button>
          </div>
        </div>
        {discount > 0 && <span className={styles.discount}>{discount}%</span>}
      </div>
    </div>
  );
}

Product.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  discount: PropTypes.number.isRequired
};