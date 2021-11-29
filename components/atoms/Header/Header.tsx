import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

export const Header = () => (
  <div className={styles.header}>
    <Link href="/" passHref>
      <a className={styles.logo}>
        (🩳) me
      </a>
    </Link>
    <ul className={styles.rightMenu}>
      <li>
        <Link href="/login">
          <a className={styles.link}>Login</a>
        </Link>
        <ul className={styles.dropdown}>
          <li>Login with Google</li>
          <li>Login with Github</li>
        </ul>
      </li>
    </ul>
  </div>
);
