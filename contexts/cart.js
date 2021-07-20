/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { CART_ITEMS, IS_ADDING, IS_CART_SIDEBAR } from "../constants";

const initialCart = {
  items: [],
  isCartSidebar: false
};

const cartTypes = {
  items: [
    {
      id: "",
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
  isCartSidebar: false,
  isAdding: false
};

const CartContext = createContext({
  updateItems: (items = []) => {},
  updateIsCartSidebar: (isCartSidebar = false) => {},
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
    case IS_CART_SIDEBAR:
      return {
        ...prevCart,
        isCartSidebar: action.isCartSidebar
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
