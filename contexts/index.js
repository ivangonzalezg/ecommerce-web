/* eslint-disable no-unused-vars */
import cookies from "js-cookie";
import { createContext } from "react";
import { USER, JWT, IS_LOADING, IS_LOGGED_IN, ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constants";

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
  isLoading: true,
  isLoggedIn: false,
  errorMessage: "",
  successMessage: ""
};

const StateContext = createContext({
  updateUser: (user = {}) => {},
  updateJwt: (jwt = "") => {},
  updateIsLoading: (isLoading = false) => {},
  updateIsLoggedIn: (isLoggedIn = false) => {},
  updateErrorMessage: (errorMessage = "") => {},
  updateSuccessMessage: (successMessage = "") => {},
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
    case IS_LOADING:
      return {
        ...prevState,
        isLoading: action.isLoading
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
    case ERROR_MESSAGE:
      return {
        ...prevState,
        errorMessage: action.errorMessage
      };
    case SUCCESS_MESSAGE:
      return {
        ...prevState,
        successMessage: action.successMessage
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
