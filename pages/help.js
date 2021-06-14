import React from "react";
import API, { getErrorMessage } from "../api";
import styles from "../styles/help.module.css";
import Faq from "../components/Faq";

export default function Help(props) {
  const { faqs } = props;
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>F.A.Q</h3>
        {faqs.map(faq => (
          <Faq key={faq.id} {...faq} />
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  let faqs = [];

  try {
    const response = await API().get("/faqs");
    faqs = response.data;
  } catch (error) {
    console.log(getErrorMessage(error));
  }

  return {
    props: {
      faqs
    }
  };
};
