import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cookies from "js-cookie";
import Link from "next/link";
import API, { getErrorMessage } from "../api";
import { StateContext } from "../contexts";
import { JWT, LOGIN, REGISTER, FORGOT_PASSWORD } from "../constants";
import styles from "../styles/modal.module.css";

function ForgotPassword(props) {
  const { onRequestClose, changeView } = props;
  const { updateSuccessMessage, updateErrorMessage } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);

  const onForgotPassword = async email => {
    try {
      setIsLoading(true);
      await API().post("auth/forgot-password", {
        email
      });
      setIsLoading(false);
      updateSuccessMessage("Se ha enviado un enlace a tu correo electrónico para el restablecimiento de tu contraseña.");
      onRequestClose();
    } catch (error) {
      setIsLoading(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    onForgotPassword(e.currentTarget.email.value);
  };

  return (
    <>
      <div className={styles.body}>
        <h3 className={styles.title}>Olvidé mi contraseña</h3>
        <span className={styles.subtitle}>Te enviaremos un enlace para restablecer su contraseña</span>
        <form className={styles.form} onSubmit={onSubmit}>
          <input type="email" name="email" placeholder="Correo electrónico" required disabled={isLoading} />
          <button type="submit" disabled={isLoading}>
            Restablecer la contraseña
          </button>
        </form>
      </div>
      <br />
      <div className={styles.footer}>
        <button className={styles.forgotPassword} onClick={() => changeView(LOGIN)}>
          Volver a inicio de sesión
        </button>
      </div>
    </>
  );
}

function Register(props) {
  const { onRequestClose, changeView } = props;
  const { updateSuccessMessage, updateErrorMessage } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);

  const onRegister = async (firstName, lastName, phone, email, password) => {
    try {
      setIsLoading(true);
      const result = await API().post("auth/local/register", {
        firstName,
        lastName,
        phone,
        email,
        username: email,
        password
      });
      setIsLoading(false);
      updateSuccessMessage("Cuenta creada, por favor confirma tu correo electrónico.");
      onRequestClose();
    } catch (error) {
      setIsLoading(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    onRegister(
      e.currentTarget.firstName.value,
      e.currentTarget.lastName.value,
      e.currentTarget.phone.value,
      e.currentTarget.email.value,
      e.currentTarget.password.value
    );
  };

  return (
    <>
      <div className={styles.body}>
        <h3 className={styles.title}>Regístrate</h3>
        <span className={styles.subtitle}>Regístrate con tu correo electrónico y contraseña</span>
        <form className={styles.form} onSubmit={onSubmit}>
          <input type="text" name="firstName" placeholder="Nombre(s)" required disabled={isLoading} />
          <input type="text" name="lastName" placeholder="Apellido(s)" required disabled={isLoading} />
          <input type="number" name="phone" placeholder="Número de teléfono" required disabled={isLoading} />
          <input type="email" name="email" placeholder="Correo electrónico" required disabled={isLoading} />
          <input type="password" name="password" placeholder="Contraseña" required disabled={isLoading} />
          <p className={styles.terms_and_conditions}>
            Al registrarte, acepta los{" "}
            <Link href="/terms-and-conditions">
              <a onClick={onRequestClose}>Términos y condiciones</a>
            </Link>
          </p>
          <button type="submit" disabled={isLoading}>
            Continuar
          </button>
        </form>
        <button className={styles.createAccount} onClick={() => changeView(LOGIN)}>
          Inicia sesión
        </button>
      </div>
    </>
  );
}

function Login(props) {
  const { onRequestClose, changeView } = props;
  const { updateJwt, updateUser, updateIsLoggedIn, updateErrorMessage } = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(false);

  const onLogin = async (identifier, password) => {
    try {
      setIsLoading(true);
      const result = await API().post("auth/local", {
        identifier,
        password
      });
      const { jwt, user } = result.data;
      cookies.set(JWT, jwt);
      updateJwt(jwt);
      updateUser(user);
      updateIsLoggedIn(true);
      setIsLoading(false);
      onRequestClose();
    } catch (error) {
      setIsLoading(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    onLogin(e.currentTarget.email.value, e.currentTarget.password.value);
  };

  return (
    <>
      <div className={styles.body}>
        <h3 className={styles.title}>Bienvenido de nuevo</h3>
        <span className={styles.subtitle}>Inicia sesión con tu correo electrónico y contraseña</span>
        <form className={styles.form} onSubmit={onSubmit}>
          <input type="email" name="email" placeholder="Correo electrónico" required disabled={isLoading} />
          <input type="password" name="password" placeholder="Contraseña" required disabled={isLoading} />
          <button type="submit" disabled={isLoading}>
            Continuar
          </button>
        </form>
        <button className={styles.createAccount} onClick={() => changeView(REGISTER)}>
          Crear cuenta nueva
        </button>
      </div>
      <div className={styles.footer}>
        <button className={styles.forgotPassword} onClick={() => changeView(FORGOT_PASSWORD)}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </>
  );
}

export default function Modal(props) {
  const { isOpen, onRequestClose } = props;
  const [view, setView] = useState(LOGIN);

  function keydownListener(event) {
    if (event.key === "Escape") {
      onRequestClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      setView(LOGIN);
      document.addEventListener("keydown", keydownListener);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", keydownListener);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const getView = () => {
    switch (view) {
      case LOGIN:
        return <Login onRequestClose={onRequestClose} changeView={setView} />;
      case REGISTER:
        return <Register onRequestClose={onRequestClose} changeView={setView} />;
      case FORGOT_PASSWORD:
        return <ForgotPassword onRequestClose={onRequestClose} changeView={setView} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.container} onClick={onRequestClose}>
        <div className={styles.wrapper} onClick={e => e.stopPropagation()}>
          {getView()}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};

Login.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired
};

Register.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired
};

ForgotPassword.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired
};
