import { useContext, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import classNames from "classnames";
import Auth from "../components/Auth";
import { StateContext } from "../contexts";
import styles from "../styles/components/header.module.css";
import { getPhotoUrl } from "../api";

export default function Header(props) {
  const { isSticky } = props;
  const { user, isLoading, isLoggedIn, updateIsLoggedIn } = useContext(StateContext);
  const [isModal, setIsModal] = useState(false);

  return (
    <header
      className={classNames(styles.header, {
        [styles.header_sticky]: isSticky
      })}
    >
      <div className={styles.container}>
        <Link href="/">
          <a>
            <Image src="/images/logo.png" alt="logo" width={110} height={18} />
          </a>
        </Link>
        <div className={styles.wrapper}>
          <Link href="/offers">
            <a className={styles.link}>Ofertas</a>
          </Link>
          <Link href="/help">
            <a className={styles.link}>¿Necesitas ayuda?</a>
          </Link>
          {isLoading ? null : isLoggedIn ? (
            <div className={styles.dropdown}>
              <Image
                loader={getPhotoUrl(user.photo?.formats?.thumbnail?.url)}
                src="/images/profile.png"
                alt="profile photo"
                width={38}
                height={38}
                className={styles.profile_photo}
              />
              <div className={styles.dropdown_content}>
                <Link href="/profile">
                  <a className={styles.dropdown_link}>Perfil</a>
                </Link>
                <Link href="/orders">
                  <a className={styles.dropdown_link}>Pedidos</a>
                </Link>
                <a className={styles.dropdown_link} onClick={() => updateIsLoggedIn(false)}>
                  Cerrar sesión
                </a>
              </div>
            </div>
          ) : (
            <button className={styles.button} onClick={() => setIsModal(true)}>
              Unirse
            </button>
          )}
        </div>
        <Auth isOpen={isModal} onRequestClose={() => setIsModal(false)} />
      </div>
    </header>
  );
}

Header.propTypes = {
  isSticky: PropTypes.bool.isRequired
};
