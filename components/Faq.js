import React, { useRef } from "react";
import { Add, Remove } from "@material-ui/icons";
import styles from "../styles/components/faq.module.css";

export default function Faq(props) {
  const { id, title, description, isOpen, updateIsOpen } = props;
  const content = useRef(null);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper} onClick={() => (isOpen ? updateIsOpen("") : updateIsOpen(id))}>
        <h3 className={styles.title}>{title}</h3>
        {isOpen ? <Remove /> : <Add />}
      </div>
      <div className={styles.description} style={{ height: isOpen ? `${content.current.clientHeight}px` : 0 }}>
        <p ref={content} className={styles.description_text}>
          {description}
        </p>
      </div>
    </div>
  );
}
