import clsx from "clsx";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FormEventHandler, useCallback, useState } from "react";
import { Navbar, TextInput } from "../components";
import { LinkList } from "../components/organisms/LinkList/LinkList";
import { db, HashedUrl } from "../db";
import { getRequestHostUrl, validateUrl } from "../utils";
import { useHostURL } from "../utils/hooks/useHostUrl";
import styles from "./Home.module.css";

interface Props {
  host?: string;
  recentUrls: HashedUrl[];
  myUrls: HashedUrl[];
}

const Home: NextPage<Props> = ({ host, recentUrls, myUrls }) => {
  const hostPrefix = useHostURL(host);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [shortened, setShortened] = useState<HashedUrl | null>(null);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      if (validateUrl(url, true)) {
        const response = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const shortenedUrl: HashedUrl = await response.json();
        setShortened(shortenedUrl);
      }
    },
    [url]
  );

  return (
    <>
      <Head>
        <title>Short me</title>
        <meta name="description" content="Link shortener" />
        <link rel="icon" href="/short.png" />
      </Head>

      <Navbar />

      <div className={styles.container}>
        <h1 className={styles.title} title="Short me">
          (🩳) me
        </h1>

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
              placeholder={hostPrefix}
              className={clsx(styles.input, !isValid && styles.invalid)}
            />
            <button disabled={!isValid} type="submit" className={styles.button}>
              Shorten
            </button>
          </div>
        </form>

        {shortened && (
          <>
            <h2>Here is your shortened link</h2>
            <p>Feel free to share it :)</p>
            <Link
              href={`/${shortened.hash}`}
            >{`${hostPrefix}${shortened.hash}`}</Link>
          </>
        )}

        <button
          type="button"
          className={styles.button}
          onClick={() => {
            fetch("/api/clear", { method: "POST" });
          }}
        >
          Reset
        </button>
        {Boolean(recentUrls.length) && (
          <>
            <h2 className={styles.linksTitle}>Popular public links:</h2>
            <LinkList className={styles.linkList} links={recentUrls} />
          </>
        )}
        {Boolean(myUrls.length) && (
          <>
            <h2 className={styles.linksTitle}>Your recent links:</h2>
            <LinkList className={styles.linkList} links={myUrls} />
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const host = `${getRequestHostUrl(ctx.req).origin}/`;
  const urls = await db.collection<"urls">("urls");
  const myUrls: HashedUrl[] = [];

  const token = ctx.req.cookies.token;

  if (token) {
    const users = await db.collection<"users">("users");
    const user = users.find((u) => u.provider_token === token).value();

    if (user) {
      myUrls.concat(urls.filter((url) => url.userId === user.id).value());
    }
  }

  const recentUrls = urls
    .sortBy((link) => link.accessCount)
    .take(10)
    .value();

  return {
    props: {
      host,
      recentUrls,
      myUrls,
    },
  };
};

export default Home;
