import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";
import PropTypes from "prop-types";
import cookies from "js-cookie";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Router, { useRouter } from "next/router";
import {
  USER,
  JWT,
  IS_LOGGED_IN,
  IS_LOADING,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  INFO_MESSAGE,
  WARNING_MESSAGE,
  IS_AUTH
} from "../constants";
import { initialState, StateContext, stateReducer } from "../contexts/state";
import { initialStatus, StatusContext, statusReducer } from "../contexts/status";
import Header from "../components/Header";
import Spacer from "../components/Spacer";
import Auth from "../components/Auth";
import API, { getErrorMessage } from "../api";
import "../styles/globals.css";

// TODO: Move this function to components folder
function Toast() {
  const { addToast } = useToasts();
  const {
    errorMessage,
    successMessage,
    infoMessage,
    warningMessage,
    updateErrorMessage,
    updateSuccessMessage,
    updateInfoMessage,
    updateWarningMessage
  } = useContext(StatusContext);

  useEffect(() => {
    if (errorMessage) {
      addToast(errorMessage, {
        appearance: "error"
      });
      updateErrorMessage("");
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      addToast(successMessage, {
        appearance: "success"
      });
      updateSuccessMessage("");
    }
  }, [successMessage]);

  useEffect(() => {
    if (infoMessage) {
      addToast(infoMessage, {
        appearance: "info"
      });
      updateInfoMessage("");
    }
  }, [infoMessage]);

  useEffect(() => {
    if (warningMessage) {
      addToast(warningMessage, {
        appearance: "warning"
      });
      updateWarningMessage("");
    }
  }, [warningMessage]);

  return null;
}

function Root({ Component, pageProps, ...props }) {
  const {
    router: { pathname }
  } = props;

  if (pathname === "/_error") {
    return <Component {...pageProps} />;
  }

  const { isLoggedIn, updateUser, updateJwt, updateIsLoggedIn } = useContext(StateContext);
  const { isLoading, isAuth, updateIsLoading, updateErrorMessage, updateIsAuth } = useContext(StatusContext);
  const [isSticky, setIsSticky] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      const query = router.query;
      if (query?.login === "true" && !isLoggedIn) {
        updateIsAuth(true);
        delete query.login;
        Router.replace({ query }, null, { shallow: true });
      }
    }
  }, [isLoading, router.query]);

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
      <Auth isOpen={isAuth} onRequestClose={() => updateIsAuth(false)} />
      <Toast />
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
      updateInfoMessage: infoMessage => dispatchStatus({ type: INFO_MESSAGE, infoMessage }),
      updateWarningMessage: warningMessage => dispatchStatus({ type: WARNING_MESSAGE, warningMessage }),
      updateIsAuth: isAuth => dispatchStatus({ type: IS_AUTH, isAuth }),
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
