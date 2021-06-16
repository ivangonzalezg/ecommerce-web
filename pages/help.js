import React, { useState } from "react";
import PropTypes from "prop-types";
import API, { getErrorMessage } from "../api";
import styles from "../styles/help.module.css";
import Faq from "../components/Faq";

export default function Help(props) {
  const { faqs } = props;
  const [openId, setOpenId] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>F.A.Q</h3>
        {faqs.map(faq => (
          <Faq key={faq.id} {...faq} isOpen={openId === faq.id} updateIsOpen={setOpenId} />
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

Help.propTypes = {
  faqs: PropTypes.array.isRequired
};
