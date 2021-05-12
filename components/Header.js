import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "../components/Modal";
import { StateContext } from "../contexts";
import styles from "../styles/header.module.css";
import { getPhotoUrl } from "../api";

export default function Header() {
  const { user, isLoading, isLoggedIn, updateIsLoggedIn } = useContext(StateContext);
  const [isModal, setIsModal] = useState(false);

  return (
    <header className={styles.header}>
      <Image src="/images/logo.png" alt="logo" width={110} height={18} />
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
              loader={user.photo?.url ? () => getPhotoUrl(user.photo.url) : undefined}
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
      <Modal isOpen={isModal} onRequestClose={() => setIsModal(false)}>
        <p>Hola mundo</p>
      </Modal>
    </header>
  );
}
