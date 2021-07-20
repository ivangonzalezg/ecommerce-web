import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Add, Remove, Close } from "@material-ui/icons";
import styles from "../styles/components/cartItem.module.css";
import { formatToCurrency, getProductSalePrice } from "../utils";
import { StateContext } from "../contexts/state";
import { CartContext } from "../contexts/cart";
import { StatusContext } from "../contexts/status";
import API, { getErrorMessage } from "../api";

export default function CartItem(props) {
  const { id, product, quantity } = props;
  const { jwt } = useContext(StateContext);
  const { isAdding, updateIsAdding, updateItems } = useContext(CartContext);
  const { updateWarningMessage, updateSuccessMessage, updateErrorMessage } = useContext(StatusContext);

  const addToCart = async () => {
    try {
      if (quantity >= product.quantity) {
        updateWarningMessage("No hay más existencias de este producto");
        return;
      }
      updateIsAdding(true);
      const response = await API(jwt).post("carts/add", {
        product: product.id
      });
      updateItems(response.data);
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
        product: product.id
      });
      updateItems(response.data);
      updateSuccessMessage("Producto removido");
      updateIsAdding(false);
    } catch (error) {
      updateIsAdding(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const removeItem = async () => {
    try {
      updateIsAdding(true);
      const response = await API(jwt).delete(`carts/item/${id}`);
      updateItems(response.data);
      updateSuccessMessage("Producto removido");
      updateIsAdding(false);
    } catch (error) {
      updateIsAdding(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className={styles.item}>
      <div className={styles.item_quantity}>
        <button className={styles.item_quantity_button} onClick={addToCart} disabled={isAdding}>
          <Add fontSize="inherit" color="inherit" />
        </button>
        <span>{quantity}</span>
        <button className={styles.item_quantity_button} onClick={removeFromCart} disabled={isAdding}>
          <Remove fontSize="inherit" color="inherit" />
        </button>
      </div>
      <img className={styles.item_image} src={product.image.url} />
      <div className={styles.item_description}>
        <span className={styles.item_description_name}>{product.name}</span>
        <br />
        <span className={styles.item_description_price}>{formatToCurrency(getProductSalePrice(product))}</span>
        <br />
        <span className={styles.item_description_quantity}>{quantity} ud(s)</span>
      </div>
      <span className={styles.item_price}>{formatToCurrency(getProductSalePrice(product) * quantity)}</span>
      <button className={styles.item_delete_button} onClick={removeItem} disabled={isAdding}>
        <Close fontSize="inherit" />
      </button>
    </div>
  );
}

CartItem.propTypes = {
  id: PropTypes.string.isRequired,
  product: PropTypes.any.isRequired,
  quantity: PropTypes.number.isRequired
};
