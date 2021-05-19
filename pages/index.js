import API, { getErrorMessage } from "../api";
import styles from "../styles/home.module.css";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home(props) {
  const { categories } = props;
  const router = useRouter();

  useEffect(() => {
    // console.log(router.query);
  }, [router.query]);

  const onSubmit = e => {
    e.preventDefault();
  };

  const goToCategory = category =>
    Router.replace(
      {
        pathname: "/",
        query: {
          category: category.slug
        }
      },
      null,
      { shallow: true }
    );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Joyería de marca e importados</h2>
        <p className={styles.subtitle}>"Your jewelry introduces you before you even speak"</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <input className={styles.query} type="text" name="query" placeholder="Busque sus productos desde aquí" />
          <button className={styles.search}>Buscar</button>
        </form>
      </div>
      <main className={styles.main}>
        <div className={styles.categories}>
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                <button className={styles.category} onClick={() => goToCategory(category)}>
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.products}>prodcutos</div>
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  let categories = [];

  try {
    const response = await API().get("/categories");
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
