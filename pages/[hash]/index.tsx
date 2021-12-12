import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { db, HashedUrl } from "../../db";

const Redirect: NextPage<{ destination: string }> = ({ destination }) => {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const redirectTo = router.isFallback ? "/" : destination;
    (window as typeof globalThis).location.href = redirectTo;
  }
  return null;
};

export const getStaticPaths = async () => {
  const urls = await db.collection<"urls">("urls");

  return {
    paths: urls.map((url) => `/${url.hash}`).value(),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const urls = await db.collection<"urls">("urls");
  const existingUrl = urls
    .find((url: HashedUrl) => url.hash === ctx.params!.hash)
    .value();

  const url = existingUrl?.url ?? "/";
  const destination = url.startsWith('http') ? url : `https://${url}`;

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
