import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";
import PropTypes from "prop-types";
import cookies from "js-cookie";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import {
  USER,
  JWT,
  IS_LOGGED_IN,
  IS_LOADING,
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  INFO_MESSAGE,
  WARNING_MESSAGE,
  IS_AUTH,
  CART_ITEMS,
  IS_CART_MODAL
} from "../constants";
import { initialState, StateContext, stateReducer } from "../contexts/state";
import { initialStatus, StatusContext, statusReducer } from "../contexts/status";
import { initialCart, CartContext, cartReducer } from "../contexts/cart";
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

  const { isLoggedIn, jwt, updateUser, updateJwt, updateIsLoggedIn } = useContext(StateContext);
  const { isLoading, isAuth, updateIsLoading, updateErrorMessage, updateIsAuth } = useContext(StatusContext);
  const { updateItems } = useContext(CartContext);
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

  const getUserCart = async () => {
    try {
      const response = await API(jwt).get("carts/me");
      updateItems(response.data);
    } catch (error) {
      updateErrorMessage(getErrorMessage(error));
    }
  };

  useEffect(() => {
    if (jwt) {
      getUserCart();
    } else {
      updateItems([]);
    }
  }, [jwt]);

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
  const [cart, dispatchCart] = useReducer(cartReducer, initialCart);

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

  const cartContext = useMemo(
    () => ({
      updateItems: items => dispatchCart({ type: CART_ITEMS, items }),
      updateIsCartModal: isCartModal => dispatchCart({ type: IS_CART_MODAL, isCartModal }),
      ...cart
    }),
    [cart]
  );

  return (
    <StatusContext.Provider value={statusContext}>
      <StateContext.Provider value={stateContext}>
        <CartContext.Provider value={cartContext}>
          <Head>
            <meta charSet="UTF-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>ANA LUCIA💎</title>
            <meta name="description" content="Your jewelry introduces you before you even speak" />
            <meta name="keywords" content="ecommerce, website, jewelry, joyas, instagram" />
            <meta name="language" content="es" />
            <meta name="author" content="Ivan Gonzalez, ivangonzalezgrc@gmail.com" />
            <meta name="url" content="http://ecommerce-web.ddns.net/" />
            <meta property="og:title" content="ANA LUCIA💎" />
            <meta property="og:type" content="jewelry" />
            <meta property="og:url" content="http://ecommerce-web.ddns.net/" />
            <meta property="og:image" content="http://ecommerce-web.ddns.net/favicon.ico" />
            <meta property="og:description" content="Your jewelry introduces you before you even speak" />
            <meta property="og:country-name" content="MEX" />
          </Head>
          <ToastProvider autoDismiss>
            <Root {...props} />
          </ToastProvider>
        </CartContext.Provider>
      </StateContext.Provider>
    </StatusContext.Provider>
  );
}

Root.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
  router: PropTypes.any.isRequired
};
