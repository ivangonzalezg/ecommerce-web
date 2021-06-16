import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import classNames from "classnames";
import styles from "../styles/components/category.module.css";
import { getPhotoUrl } from "../api";

export default function Category(props) {
  const { category, isCategorySelected, goToCategory } = props;

  return (
    <li className={styles.container} key={category.id}>
      <button
        className={classNames(styles.wrapper, {
          [styles.active]: isCategorySelected
        })}
        onClick={() => goToCategory(category.slug)}
      >
        <Image className={styles.icon} loader={getPhotoUrl(category?.icon?.url)} src="/images/box.png" width={20} height={20} />
        <span className={styles.name}>{category.name}</span>
      </button>
    </li>
  );
}

Category.propTypes = {
  category: PropTypes.object.isRequired,
  isCategorySelected: PropTypes.bool.isRequired,
  goToCategory: PropTypes.func.isRequired
};
