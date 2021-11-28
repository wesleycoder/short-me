import { IncomingMessage } from "http";

export function getRequestHostUrl(
  req: IncomingMessage,
  defaultLocalhost: string = "localhost:3000"
) {
  let isSecure = true;

  const host = req
    ? ((req.headers["x-forwarded-host"] || req.headers["host"]) as string)
    : window?.location?.host || defaultLocalhost;

  if (host.indexOf("localhost") > -1) {
    isSecure = false;
  }

  const protocol = isSecure ? "https" : "http";

  return {
    protocol: protocol,
    host: host,
    origin: `${protocol}://${host}`,
  };
}
