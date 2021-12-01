import Link from "next/link";
import { ComponentProps } from "react";
import { HashedUrl } from "../../../db";
import { useHostURL } from "../../../utils/hooks/useHostUrl";
import styles from "./LinkList.module.css";

interface Props extends ComponentProps<"ul"> {
  links: HashedUrl[];
}

export const LinkList = ({ links = [], ...props }: Props) => {
  const host = useHostURL();
  return (
    <ul {...props} className={styles.linkList}>
      {links.map(({ url, hash }) => (
        <li key={hash}>
          <Link href={`/${hash}`}>{hash}</Link>
          <br />
          {url}
        </li>
      ))}
    </ul>
  );
};
