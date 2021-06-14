import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import cookies from "js-cookie";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { USER, JWT, IS_LOGGED_IN, IS_LOADING, ERROR_MESSAGE, SUCCESS_MESSAGE } from "../constants";
import { initialState, StateContext, stateReducer } from "../contexts";
import Header from "../components/Header";
import Spacer from "../components/Spacer";
import API, { getErrorMessage } from "../api";
import "../styles/globals.css";

function Toast(props) {
  const { addToast } = useToasts();
  const { updateErrorMessage, updateSuccessMessage } = useContext(StateContext);

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

  const [state, dispatchState] = useReducer(stateReducer, initialState);
  const [isSticky, setIsSticky] = useState(false);

  const getUserInfo = async jwt => {
    try {
      const response = await API(jwt).get("users/me");
      const user = response.data;
      dispatchState({ type: USER, user });
      dispatchState({ type: JWT, jwt });
      dispatchState({ type: IS_LOGGED_IN, isLoggedIn: true });
    } catch (error) {
      cookies.remove(JWT);
      dispatchState({ type: ERROR_MESSAGE, errorMessage: getErrorMessage(error) });
    }
    dispatchState({ type: IS_LOADING, isLoading: false });
  };

  useEffect(() => {
    const jwt = cookies.get(JWT);
    if (jwt) {
      getUserInfo(jwt);
    } else {
      dispatchState({ type: IS_LOADING, isLoading: false });
    }
  }, []);

  const stateContext = useMemo(
    () => ({
      updateUser: user => dispatchState({ type: USER, user }),
      updateJwt: jwt => dispatchState({ type: JWT, jwt }),
      updateIsLoading: isLoading => dispatchState({ type: IS_LOADING, isLoading }),
      updateIsLoggedIn: isLoggedIn => dispatchState({ type: IS_LOGGED_IN, isLoggedIn }),
      updateErrorMessage: errorMessage => dispatchState({ type: ERROR_MESSAGE, errorMessage }),
      updateSuccessMessage: successMessage => dispatchState({ type: SUCCESS_MESSAGE, successMessage }),
      ...state
    }),
    [state]
  );

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

  return (
    <StateContext.Provider value={stateContext}>
      <Header isSticky={isSticky} />
      <Spacer pathname={pathname} isSticky={isSticky} />
      <Component {...pageProps} />
      <Toast errorMessage={state.errorMessage} successMessage={state.successMessage} />
    </StateContext.Provider>
  );
}

export default function App(props) {
  return (
    <ToastProvider autoDismiss>
      <Root {...props} />
    </ToastProvider>
  );
}
