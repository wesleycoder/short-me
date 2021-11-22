import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/dist/client/router";

const Redirect: NextPage = () => {
  const router = useRouter()
  const { hash } = router.query
  if (typeof window === "undefined") {
    (window as typeof globalThis).location.href = "https://google.com.br";
  }
  return null;
};

Redirect.getInitialProps = (ctx: NextPageContext) => {
  const { hash } = ctx.query
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: "https://google.com" });
    ctx.res.end();
  }

  return {};
};

export default Redirect;
