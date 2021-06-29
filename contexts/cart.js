/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { CART_ITEMS, IS_CART_MODAL } from "../constants";

const initialCart = {
  items: [],
  isCartModal: false
};

const cartTypes = {
  items: [
    {
      id: "",
      product: {
        quantity: "",
        discount: 0,
        gallery: [
          {
            url: "",
            id: ""
          }
        ],
        name: "",
        description: "",
        slug: "anillo-compromiso-oro-rosa-18-k",
        price: "",
        image: {
          url: "",
          id: ""
        },
        id: ""
      }
    }
  ],
  isCartModal: false
};

const CartContext = createContext({
  updateItems: (items = []) => {},
  updateIsCartModal: (isCartModal = false) => {},
  ...cartTypes
});

const cartReducer = (prevCart, action) => {
  switch (action.type) {
    case CART_ITEMS:
      return {
        ...prevCart,
        items: action.items
      };
    case IS_CART_MODAL:
      return {
        ...prevCart,
        isCartModal: action.isCartModal
      };
    default:
      return prevCart;
  }
};

export { initialCart, CartContext, cartReducer };
