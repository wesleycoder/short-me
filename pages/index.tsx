import clsx from "clsx";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { Navbar, TextInput } from "../components";
import { LinkList } from "../components/organisms/LinkList/LinkList";
import { getRequestHostUrl, validateUrl } from "../utils";
import { useHostURL } from "../utils/hooks/useHostUrl";
import styles from "./Home.module.css";

interface Props {
  host?: string;
}

const mockLinks = [
  { url: "yt.com", hash: "asdf1234" },
  { url: "yt.com", hash: "asdf1234" },
  { url: "google.com", hash: "abcd1234" },
  { url: "yt.com", hash: "asdf1234" },
  { url: "yt.com", hash: "asdf1234" },
  { url: "google.com", hash: "abcd1234" },
  { url: "yt.com", hash: "asdf1234" },
  { url: "yt.com", hash: "asdf1234" },
  { url: "google.com", hash: "abcd1234" },
];

const Home: NextPage<Props> = ({ host }) => {
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

        {mockLinks.length && (
          <>
            <h2 className={styles.linksTitle}>Popular public links:</h2>
            <LinkList className={styles.linkList} links={mockLinks} />
          </>
        )}
        {mockLinks.length && (
          <>
            <h2 className={styles.linksTitle}>Your recent links:</h2>
            <LinkList className={styles.linkList} links={mockLinks} />
          </>
        )}
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
