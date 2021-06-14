import React, { useState } from "react";
import { Add, Remove } from "@material-ui/icons";
import styles from "../styles/components/faq.module.css";
import classNames from "classnames";

export default function Faq(props) {
  const { title, description } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} onClick={() => setIsOpen(!isOpen)}>
        <h3 className={styles.title}>{title}</h3>
        {isOpen ? <Remove /> : <Add />}
      </div>
      <div className={classNames(styles.description, { [styles.description_open]: isOpen })}>
        <p className={styles.description_text}>{description}</p>
      </div>
    </div>
  );
}
