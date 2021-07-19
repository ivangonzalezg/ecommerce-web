/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { CART_ITEMS, IS_ADDING, IS_CART_MODAL } from "../constants";

const initialCart = {
  items: [],
  isCartModal: false
};

const cartTypes = {
  items: [
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
  updateItems: (items = []) => {},
  updateIsCartModal: (isCartModal = false) => {},
  updateIsAdding: (isAdding = false) => {},
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
