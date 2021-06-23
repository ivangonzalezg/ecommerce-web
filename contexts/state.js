/* eslint-disable no-unused-vars */
import cookies from "js-cookie";
import { createContext } from "react";
import { USER, JWT, IS_LOGGED_IN } from "../constants";

const initialState = {
  user: {
    id: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photo: {
      url: "",
      formats: {
        thumbnail: {
          url: ""
        }
      }
    }
  },
  jwt: "",
  isLoggedIn: false
};

const StateContext = createContext({
  updateUser: (user = {}) => {},
  updateJwt: (jwt = "") => {},
  updateIsLoggedIn: (isLoggedIn = false) => {},
  ...initialState
});

const stateReducer = (prevState, action) => {
  switch (action.type) {
    case USER:
      return {
        ...prevState,
        user: action.user
      };
    case JWT:
      return {
        ...prevState,
        jwt: action.jwt
      };
    case IS_LOGGED_IN:
      if (action.isLoggedIn) {
        return {
          ...prevState,
          isLoggedIn: true
        };
      } else {
        cookies.remove(JWT);
        return {
          ...prevState,
          ...initialState,
          isLoading: false
        };
      }
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
