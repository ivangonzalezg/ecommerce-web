import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import cookies from "js-cookie";
import API, { getErrorMessage } from "../api";
import { StateContext } from "../contexts";
import { JWT } from "../constants";
import styles from "../styles/modal.module.css";

export default function Modal(props) {
  const { isOpen, onRequestClose } = props;
  const { updateJwt, updateUser, updateIsLoggedIn, updateErrorMessage } = useContext(StateContext);

  function keydownListener(event) {
    if (event.key === "Escape") {
      onRequestClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", keydownListener);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", keydownListener);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const onSubmit = async e => {
    try {
      e.preventDefault();
      const result = await API().post("auth/local", {
        identifier: e.currentTarget.email.value,
        password: e.currentTarget.password.value
      });
      const { jwt, user } = result.data;
      cookies.set(JWT, jwt);
      updateJwt(jwt);
      updateUser(user);
      updateIsLoggedIn(true);
      onRequestClose();
    } catch (error) {
      updateErrorMessage(getErrorMessage(error));
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modal}>
      <div className={styles.container} onClick={onRequestClose}>
        <div className={styles.wrapper} onClick={e => e.stopPropagation()}>
          <div className={styles.body}>
            <h3 className={styles.title}>Bienvenido de nuevo</h3>
            <span className={styles.subtitle}>Inicie sesión con su correo electrónico y contraseña</span>
            <form className={styles.form} onSubmit={onSubmit}>
              <input type="email" name="email" placeholder="Correo electrónico" required />
              <input type="password" name="password" placeholder="Contraseña" required />
              <button type="submit">Continuar</button>
            </form>
            <button className={styles.createAccount}>Crear cuenta nueva</button>
          </div>
          <div className={styles.footer}>
            <button className={styles.forgotPassword}>¿Olvidaste tu contraseña?</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
};
