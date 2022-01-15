import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FormEventHandler, useCallback, useState } from "react";
import { Navbar, TextInput } from "../components";
import { LinkList } from "../components/organisms/LinkList/LinkList";
import { getRequestHostUrl, validateUrl } from "../utils";
import { useHostURL } from "../utils/hooks/useHostUrl";
import styles from "./Home.module.css";
import { dbClient } from "../db/db";
import type { definitions } from "../types/database/index";

interface Props {
  host?: string;
  recentUrls: definitions["urls"][];
  myUrls: definitions["urls"][];
}

const Home: NextPage<Props> = ({ host, recentUrls, myUrls }) => {
  const hostPrefix = useHostURL(host);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [shortened, setShortened] = useState<definitions["urls"] | null>(null);

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (e) => {
      e.preventDefault();

      if (validateUrl(url, true)) {
        const response = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const shortenedUrl: definitions["urls"] = await response.json();
        setUrl("");
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

      <Navbar
        onLogin={(...args: any[]) => {
          // console.log(...args);
        }}
      />

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
              value={url}
              onChangeText={setUrl}
              onValidate={setIsValid}
              validate={validateUrl}
              placeholder={hostPrefix}
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
  const recentUrlsResponse = await dbClient
    .from<definitions["urls"]>("urls")
    .select()
    .or("public.is.true,user_id.is.null")
    .limit(10);

  const recentUrls = recentUrlsResponse.data || [];
  const myUrls: definitions["urls"][] = [];

  const token = ctx.req.cookies.token;

  if (token) {
    const user = await dbClient.auth.user();
    if (user) {
      const myUrlsResponse = await dbClient
        .from<definitions["urls"]>("urls")
        .select()
        .eq("user_id", user.id)
        .order("created_at")
        .limit(10);

      myUrls.concat(myUrlsResponse.data || []);
    }
  }

  return {
    props: {
      host,
      recentUrls,
      myUrls,
    },
  };
};

export default Home;
