import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import qs from "qs";
import Card from "../components/Card";
import styles from "../styles/reset-password.module.css";
import API, { getErrorMessage, getPhotoUrl } from "../api";
import { StatusContext } from "../contexts/status";
import { StateContext } from "../contexts/state";

export default function ResetPassword(props) {
  const { user } = props;
  const router = useRouter();
  const { updateErrorMessage, updateSuccessMessage } = useContext(StatusContext);
  const { jwt } = useContext(StateContext);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jwt) {
      Router.replace("/");
    }
  }, [jwt]);

  const onResetPassword = async () => {
    try {
      setIsLoading(true);
      const {
        query: { code }
      } = router;
      await API().post("/auth/reset-password", {
        code,
        password,
        passwordConfirmation
      });
      updateSuccessMessage("Tu contraseña ha sido cambiada");
      Router.replace({
        pathname: "/",
        query: {
          login: "true"
        }
      });
    } catch (error) {
      setIsLoading(false);
      updateErrorMessage(getErrorMessage(error));
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    onResetPassword();
  };

  return (
    <div className={styles.container}>
      <Card style={styles.card}>
        <h3>Cambiar contraseña</h3>
        <br />
        <Image
          loader={getPhotoUrl(user.photo?.formats?.thumbnail?.url)}
          src="/images/profile.png"
          alt="profile photo"
          width={70}
          height={70}
          className={styles.profile_photo}
        />
        <span className={styles.email}>{user.email}</span>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Nueva contraseña"
            required
            disabled={isLoading}
          />
          <input
            className={styles.input}
            value={passwordConfirmation}
            onChange={e => setPasswordConfirmation(e.target.value)}
            type="password"
            placeholder="Repitir nueva contraseña"
            required
            disabled={isLoading}
          />
          <button className={styles.button} type="submit" disabled={isLoading}>
            Cambiar contraseña
          </button>
        </form>
      </Card>
    </div>
  );
}

export const getServerSideProps = async context => {
  if (context.req?.cookies?.jwt) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    };
  }
  const { code } = context.query;

  if (!code) {
    return {
      notFound: true
    };
  }

  try {
    const query = qs.stringify({
      code
    });
    const user = await API("", true).get(`/custom/userbycode?${query}`);
    return {
      props: { user: user.data }
    };
  } catch (error) {
    console.log(getErrorMessage(error));
    return {
      notFound: true
    };
  }
};

ResetPassword.propTypes = {
  user: PropTypes.any
};
