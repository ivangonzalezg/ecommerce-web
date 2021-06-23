import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Router, { useRouter } from "next/router";
import qs from "qs";
import styles from "../styles/index.module.css";
import API, { getErrorMessage } from "../api";
import { StatusContext } from "../contexts/status";
import Category from "../components/Category";
import Product from "../components/Product";

export default function Home(props) {
  const { categories } = props;
  const router = useRouter();
  const { updateErrorMessage } = useContext(StatusContext);
  const [name, setName] = useState(router.query?.name || "");
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const query = qs.stringify({
        "category.slug": router.query?.category,
        name_contains: router.query?.name,
        quantity_gt: 0
      });
      const response = await API().get(`/products?${query}`);
      setProducts(response.data);
    } catch (error) {
      updateErrorMessage(getErrorMessage(error));
    }
  };

  useEffect(() => {
    getProducts();
  }, [router.query]);

  const updateQuery = query =>
    Router.replace(
      {
        query: {
          ...router.query,
          ...query
        }
      },
      null,
      { shallow: true }
    );

  const onSubmit = e => {
    e.preventDefault();
    updateQuery({ name });
  };

  const isCategorySelected = slug => (router.query?.category ? router.query?.category === slug : false);

  const goToCategory = category => updateQuery({ category });

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Joyería de marca e importados</h2>
        <p className={styles.subtitle}>&quot;Your jewelry introduces you before you even speak&quot;</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            className={styles.name}
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Busque sus productos desde aquí"
          />
          <button className={styles.search}>Buscar</button>
        </form>
      </div>
      <main className={styles.main}>
        <div className={styles.categories}>
          <ul>
            {categories.map(category => (
              <Category
                key={category.id}
                category={category}
                isCategorySelected={isCategorySelected(category.slug)}
                goToCategory={goToCategory}
              />
            ))}
          </ul>
        </div>
        <div className={styles.products_container}>
          <div className={styles.products}>
            {products.map(product => (
              <Product key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  let categories = [];

  try {
    const response = await API("", true).get("/categories");
    categories = response.data;
  } catch (error) {
    console.log(getErrorMessage(error));
  }

  return {
    props: {
      categories
    }
  };
};

Home.propTypes = {
  categories: PropTypes.array.isRequired
};
