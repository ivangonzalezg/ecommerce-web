/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { CART_PRODUCTS, IS_ADDING, IS_CART_MODAL } from "../constants";

const initialCart = {
  products: [],
  isCartModal: false
};

const cartTypes = {
  products: [
    {
      quantity: 0,
      product: {
        discount: 0,
        gallery: [
          {
            url: ""
          }
        ],
        name: "",
        description: "",
        slug: "anillo-compromiso-oro-rosa-18-k",
        price: "",
        image: {
          url: ""
        },
        id: ""
      }
    }
  ],
  isCartModal: false,
  isAdding: false
};

const CartContext = createContext({
  updateProducts: (products = []) => {},
  updateIsCartModal: (isCartModal = false) => {},
  updateIsAdding: (isAdding = false) => {},
  ...cartTypes
});

const cartReducer = (prevCart, action) => {
  switch (action.type) {
    case CART_PRODUCTS:
      return {
        ...prevCart,
        products: action.products
      };
    case IS_CART_MODAL:
      return {
        ...prevCart,
        isCartModal: action.isCartModal
      };
    case IS_ADDING:
      return {
        ...prevCart,
        isAdding: action.isAdding
      };
    default:
      return prevCart;
  }
};

export { initialCart, CartContext, cartReducer };
