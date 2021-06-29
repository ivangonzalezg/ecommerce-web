/* eslint-disable no-unused-vars */
import { createContext } from "react";
import { IS_LOADING, ERROR_MESSAGE, SUCCESS_MESSAGE, IS_AUTH, INFO_MESSAGE, WARNING_MESSAGE } from "../constants";

const initialStatus = {
  isLoading: true,
  errorMessage: "",
  successMessage: "",
  infoMessage: "",
  warningMessage: "",
  isAuth: false
};

const StatusContext = createContext({
  updateIsLoading: (isLoading = false) => {},
  updateErrorMessage: (errorMessage = "") => {},
  updateSuccessMessage: (successMessage = "") => {},
  updateInfoMessage: (infoMessage = "") => {},
  updateWarningMessage: (warningMessage = "") => {},
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
    case INFO_MESSAGE:
      return {
        ...prevStatus,
        infoMessage: action.infoMessage
      };
    case WARNING_MESSAGE:
      return {
        ...prevStatus,
        warningMessage: action.warningMessage
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
