import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/components/spacer.module.css";

export default function Spacer(props) {
  const { pathname, isSticky } = props;

  if (!isSticky || pathname === "/") {
    return null;
  }

  return <div className={styles.container} />;
}

Spacer.propTypes = {
  pathname: PropTypes.string.isRequired,
  isSticky: PropTypes.bool.isRequired
};
