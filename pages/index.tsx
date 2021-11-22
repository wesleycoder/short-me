import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Short me</title>
        <meta name="description" content="Link shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Short me</h1>
      <form className={styles.form}>
        <label htmlFor="link" className={styles.label}>
          Paste your link below and we&#39;ll shorten it for you:
        </label>
        <div className={styles.formGroup}>
          <input name="link" type="text" className={styles.input} />
          <button type="submit" className={styles.button}>
            Shorten
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
