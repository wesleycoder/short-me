import clsx from "clsx";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Navbar, TextInput } from "../components";
import { getRequestHostUrl, validateUrl } from "../utils";
import styles from "./Home.module.css";

interface HomeProps {
  host?: string;
}

const useHostURL = (defaultHost: string = "https://short.me") => {
  const [host, setHost] = useState(defaultHost);

  useEffect(() => {
    setHost(window?.location?.href || defaultHost);
  }, [defaultHost]);

  return host;
};

const Home: NextPage<HomeProps> = ({ host }) => {
  const placeholder = useHostURL(host);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (validateUrl(url, true)) {
      await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });
    }
  }, [url]);

  return (
    <>
      <Head>
        <title>Short me</title>
        <meta name="description" content="Link shortener" />
        <link rel="icon" href="/short.png" />
      </Head>

      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title} title="Short me">(🩳) me</h1>

        <form
          action="/api/shorten"
          method="POST"
          noValidate
          onSubmit={onSubmit}
          className={styles.form}
        >
          <label htmlFor="url" className={styles.label}>
            Paste your link below and we&#39;ll shorten it for you:
          </label>
          <div className={styles.formGroup}>
            <TextInput
              name="url"
              type="url"
              required
              autoFocus
              defaultValue={url}
              onChangeText={setUrl}
              onValidate={setIsValid}
              validate={validateUrl}
              placeholder={placeholder}
              className={clsx(styles.input, !isValid && styles.invalid)}
            />
            <button disabled={!isValid} type="submit" className={styles.button}>
              Shorten
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  props: {
    host: `${getRequestHostUrl(ctx.req).origin}/`,
  },
});

export default Home;
