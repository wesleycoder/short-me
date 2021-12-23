import type { GetStaticProps, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { ParsedUrlQuery } from "querystring";
import { dbClient } from "../../db";
import { definitions } from "../../types/database/index";

const Redirect: NextPage<{ destination: string }> = ({ destination }) => {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const redirectTo = router.isFallback ? "/" : destination;
    (window as typeof globalThis).location.href = redirectTo;
  }
  return null;
};

export const getStaticPaths = async () => {
  const urls =
    (await dbClient.from<definitions["urls"]>("urls").select()).data || [];

  return {
    paths: urls.map((url) => `/${url.hash}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  let url = "/";

  if (
    ctx.params?.hash &&
    typeof ctx.params.hash === "string" &&
    /^[a-zA-Z0-9]{6}$/.test(ctx.params.hash)
  ) {
    const urls =
      (await dbClient.from<definitions["urls"]>("urls").select()).data || [];
    const existingUrl = urls.find((url) => url.hash === ctx.params?.hash);
  
    url = existingUrl?.url ?? "/";
  }

  const destination = /^(\/|http)/.test(url) ? url : `https://${url}`;

  return {
    redirect: {
      destination,
      permanent: false,
    },
    props: {
      destination,
    },
  };
};

export default Redirect;
