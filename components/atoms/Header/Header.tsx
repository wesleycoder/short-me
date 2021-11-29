import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const isLoggedIn = true;

export const Header = () => (
  <div className={styles.header}>
    <Link href="/" passHref>
      <a className={styles.logo}>
        🩳 Short me
      </a>
    </Link>
    <ul className={styles.rightMenu}>
      <li>
        <Link href="/login">
          <a className={styles.rightMenuItem}>Login</a>
        </Link>
        <ul className={styles.dropdown}>
          <li>Login with Google</li>
          <li>Login with Github</li>
        </ul>
      </li>
    </ul>
  </div>
);
