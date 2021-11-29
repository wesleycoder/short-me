import type { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { connectDB, db, HashedUrl } from "../../db";

const Redirect: NextPage<{ destination: string }> = ({ destination }) => {
  const router = useRouter();

  if (typeof window !== "undefined") {
    const redirectTo = router.isFallback ? "/" : destination;
    (window as typeof globalThis).location.href = redirectTo;
  }
  return null;
};

export const getStaticPaths = async () => {
  await connectDB();
  return {
    paths: db.data!.urls.map((url) => `/${url.hash}`),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  await connectDB();
  const existingUrl = db.chain.get("urls").find((url: HashedUrl) =>
    url.hash === ctx.params!.hash
  ).value();
  return {
    redirect: {
      destination: existingUrl?.url ?? "/",
      permanent: false,
    },
    props: {
      destination: existingUrl?.url ?? "/",
    },
  };
};

export default Redirect;
