import type { NextPage } from "next";
import Head from "next/head";
import styles from "./Home.module.css";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Short me</title>
        <meta name="description" content="Link shortener" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Hello</h1>
    </>
  );
};

export default Home;
