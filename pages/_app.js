import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";
import PropTypes from "prop-types";
import cookies from "js-cookie";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { USER, JWT, IS_LOGGED_IN, IS_LOADING, ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constants";
import { initialState, StateContext, stateReducer } from "../contexts/state";
import { initialStatus, StatusContext, statusReducer } from "../contexts/status";
import Header from "../components/Header";
import Spacer from "../components/Spacer";
import API, { getErrorMessage } from "../api";
import "../styles/globals.css";

function Toast(props) {
  const { addToast } = useToasts();
  const { updateErrorMessage, updateSuccessMessage } = useContext(StatusContext);

  useEffect(() => {
    if (props.errorMessage) {
      addToast(props.errorMessage, {
        appearance: "error"
      });
      updateErrorMessage("");
    }
  }, [props.errorMessage]);

  useEffect(() => {
    if (props.successMessage) {
      addToast(props.successMessage, {
        appearance: "success"
      });
      updateSuccessMessage("");
    }
  }, [props.successMessage]);

  return null;
}

function Root({ Component, pageProps, ...props }) {
  const {
    router: { pathname }
  } = props;

  if (pathname === "/_error") {
    return <Component {...pageProps} />;
  }

  const { updateUser, updateJwt, updateIsLoggedIn } = useContext(StateContext);
  const { updateIsLoading, updateErrorMessage, errorMessage, successMessage } = useContext(StatusContext);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    setIsSticky(false);
    const query = document.querySelector("form input[class*='name']");
    const offset = query?.offsetTop || 0;
    if (pathname === "/") {
      window.onscroll = () => {
        if (window.pageYOffset >= offset + 48) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      };
    } else {
      window.onscroll = null;
      setIsSticky(true);
    }
    return () => {};
  }, [pathname]);

  const getUserInfo = async jwt => {
    try {
      const response = await API(jwt).get("users/me");
      const user = response.data;
      updateUser(user);
      updateJwt(jwt);
      updateIsLoggedIn(true);
    } catch (error) {
      cookies.remove(JWT);
      updateErrorMessage(getErrorMessage(error));
    }
    updateIsLoading(false);
  };

  useEffect(() => {
    const jwt = cookies.get(JWT);
    if (jwt) {
      getUserInfo(jwt);
    } else {
      updateIsLoading(false);
    }
  }, []);

  return (
    <>
      <Header isSticky={isSticky} />
      <Spacer pathname={pathname} isSticky={isSticky} />
      <Component {...pageProps} />
      <Toast errorMessage={errorMessage} successMessage={successMessage} />
    </>
  );
}

export default function App(props) {
  const [state, dispatchState] = useReducer(stateReducer, initialState);
  const [status, dispatchStatus] = useReducer(statusReducer, initialStatus);

  const stateContext = useMemo(
    () => ({
      updateUser: user => dispatchState({ type: USER, user }),
      updateJwt: jwt => dispatchState({ type: JWT, jwt }),
      updateIsLoggedIn: isLoggedIn => dispatchState({ type: IS_LOGGED_IN, isLoggedIn }),
      ...state
    }),
    [state]
  );

  const statusContext = useMemo(
    () => ({
      updateIsLoading: isLoading => dispatchStatus({ type: IS_LOADING, isLoading }),
      updateErrorMessage: errorMessage => dispatchStatus({ type: ERROR_MESSAGE, errorMessage }),
      updateSuccessMessage: successMessage => dispatchStatus({ type: SUCCESS_MESSAGE, successMessage }),
      ...status
    }),
    [status]
  );
  return (
    <StatusContext.Provider value={statusContext}>
      <StateContext.Provider value={stateContext}>
        <ToastProvider autoDismiss>
          <Root {...props} />
        </ToastProvider>
      </StateContext.Provider>
    </StatusContext.Provider>
  );
}

Root.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
  router: PropTypes.any.isRequired
};
