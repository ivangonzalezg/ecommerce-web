import React, { useContext } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { Add, Remove } from "@material-ui/icons";
import classNames from "classnames";
import styles from "../styles/components/product.module.css";
import API, { getErrorMessage, getPhotoUrl } from "../api";
import { StateContext } from "../contexts/state";
import { StatusContext } from "../contexts/status";
import { CartContext } from "../contexts/cart";

export default function Product(props) {
  const { id, image, name, quantity, price, discount } = props;
  const { jwt, isLoggedIn } = useContext(StateContext);
  const { updateErrorMessage, updateSuccessMessage, updateIsAuth, updateWarningMessage } = useContext(StatusContext);
  const { products, updateProducts, isAdding, updateIsAdding } = useContext(CartContext);

  const productInCart = products.find(item => item.product.id === id) || { quantity: 0 };

  const addToCart = async () => {
    try {
      if (!isLoggedIn) {
        updateIsAuth(true);
        return;
      }
      if (productInCart.quantity >= quantity) {
        updateWarningMessage("No hay más existencias de este producto");
        return;
      }
      updateIsAdding(true);
      const response = await API(jwt).post("/carts/add", {
        product: id
      });
      updateProducts(response.data);
      updateSuccessMessage("Producto añadido");
      updateIsAdding(false);
    } catch (error) {
      updateIsAdding(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const removeFromCart = async () => {
    try {
      updateIsAdding(true);
      const response = await API(jwt).post("carts/remove", {
        product: id
      });
      updateProducts(response.data);
      updateSuccessMessage("Producto removido");
      updateIsAdding(false);
    } catch (error) {
      updateIsAdding(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

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
            {productInCart.quantity ? (
              <div
                className={classNames(styles.cart_button_cart, {
                  [styles.cart_button_disabled]: isAdding
                })}
              >
                <button className={classNames(styles.cart_button_modify)} onClick={removeFromCart} disabled={isAdding}>
                  <Remove />
                </button>
                <span className={styles.cart_button_quantity}>{productInCart.quantity}</span>
                <button className={classNames(styles.cart_button_modify)} onClick={addToCart} disabled={isAdding}>
                  <Add />
                </button>
              </div>
            ) : (
              <button className={classNames(styles.cart_button)} onClick={addToCart} disabled={isAdding}>
                <Image className={styles.cart} src="/images/cart.png" width={12} height={12} />
                <span>Carrito</span>
              </button>
            )}
          </div>
        </div>
        {discount > 0 && <span className={styles.discount}>{discount}%</span>}
      </div>
    </div>
  );
}

Product.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  image: PropTypes.object.isRequired,
  discount: PropTypes.number.isRequired
};
