/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { IS_LOADING, ERROR_MESSAGE, SUCCESS_MESSAGE, IS_AUTH } from "../constants";

const initialStatus = {
  isLoading: true,
  errorMessage: "",
  successMessage: "",
  isAuth: false
};

const StatusContext = createContext({
  updateIsLoading: (isLoading = false) => {},
  updateErrorMessage: (errorMessage = "") => {},
  updateSuccessMessage: (successMessage = "") => {},
  updateIsAuth: (isAuth = false) => {},
  ...initialStatus
});

const statusReducer = (prevStatus, action) => {
  switch (action.type) {
    case IS_LOADING:
      return {
        ...prevStatus,
        isLoading: action.isLoading
      };
    case ERROR_MESSAGE:
      return {
        ...prevStatus,
        errorMessage: action.errorMessage
      };
    case SUCCESS_MESSAGE:
      return {
        ...prevStatus,
        successMessage: action.successMessage
      };
    case IS_AUTH:
      return {
        ...prevStatus,
        isAuth: action.isAuth
      };
    default:
      return prevStatus;
  }
};

export { initialStatus, StatusContext, statusReducer };
