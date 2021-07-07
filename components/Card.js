import React from "react";
import PropTypes from "prop-types";
import styles from "../styles/components/card.module.css";
import classNames from "classnames";

export default function Card(props) {
  const { children, style } = props;
  return <div className={classNames(styles.card, style)}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.any.isRequired,
  style: PropTypes.string
};

Card.defaultProps = {
  style: ""
};
