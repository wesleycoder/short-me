import type { GetStaticProps, GetStaticPropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
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
  const { data: urls = [] } = await dbClient
    .from<definitions["urls"]>("urls")
    .select();

  return {
    paths: urls!.map((url) => `/${url.hash}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  let url = "/";

  if (
    ctx.params?.hash &&
    typeof ctx.params.hash === "string" &&
    /^[a-zA-Z0-9_-]{14}$/.test(ctx.params.hash)
  ) {
    const { data: existingUrl } = await dbClient
      .from<definitions["urls"]>("urls")
      .select("url")
      .eq("hash", ctx.params.hash)
      .maybeSingle();

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
