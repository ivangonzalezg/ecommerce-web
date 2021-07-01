import React, { useContext, useState } from "react";
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
  const { items, updateItems } = useContext(CartContext);
  const [disabled, setDisabled] = useState(false);

  const productsInCart = items.filter(item => item.product.id === id).length;

  const addToCart = async () => {
    try {
      if (!isLoggedIn) {
        updateIsAuth(true);
        return;
      }
      if (Number(productsInCart) >= Number(quantity)) {
        updateWarningMessage("No hay más existencias de este producto");
        return;
      }
      setDisabled(true);
      const response = await API(jwt).post("/carts/add", {
        product: id
      });
      updateItems(response.data);
      updateSuccessMessage("Producto añadido");
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const removeFromCart = async () => {
    try {
      setDisabled(true);
      const response = await API(jwt).post("carts/remove", {
        product: id
      });
      updateItems(response.data);
      updateSuccessMessage("Producto removido");
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
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
            {productsInCart > 0 ? (
              <div
                className={classNames(styles.cart_button_cart, {
                  [styles.cart_button_disabled]: disabled
                })}
              >
                <button
                  className={classNames(styles.cart_button_modify, {
                    [styles.cart_button_disabled]: disabled
                  })}
                  onClick={removeFromCart}
                  disabled={disabled}
                >
                  <Remove fontSize="inherit" />
                </button>
                <span className={styles.cart_button_quantity}>{productsInCart}</span>
                <button
                  className={classNames(styles.cart_button_modify, {
                    [styles.cart_button_disabled]: disabled
                  })}
                  onClick={addToCart}
                  disabled={disabled}
                >
                  <Add fontSize="inherit" />
                </button>
              </div>
            ) : (
              <button
                className={classNames(styles.cart_button, {
                  [styles.cart_button_disabled]: disabled
                })}
                onClick={addToCart}
                disabled={disabled}
              >
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
  price: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  image: PropTypes.object.isRequired,
  discount: PropTypes.number.isRequired
};
