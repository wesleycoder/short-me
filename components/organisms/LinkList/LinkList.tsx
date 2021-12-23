import Link from "next/link";
import { ComponentProps } from "react";
import styles from "./LinkList.module.css";
import type { definitions } from "../../../types/database";

interface Props extends ComponentProps<"ul"> {
  links: definitions["urls"][];
}

export const LinkList = ({ links = [], ...props }: Props) => {
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
