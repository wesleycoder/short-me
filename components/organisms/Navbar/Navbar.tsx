import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

const isLoggedIn = false;

export const Navbar = () => (
  <div className={styles.navbar}>
    <Link href="/" passHref>
      <a className={styles.logo}>
        🩳 Short me
      </a>
    </Link>
    <ul className={styles.rightMenu}>
      {isLoggedIn
        ? (
          <li>
            <Link href="/profile">
              <a className={styles.rightMenuItem}>👤 Profile</a>
            </Link>
            <ul className={styles.dropdown}>
              <li>
                <Link href="/profile">View my profile</Link>
              </li>
              <li>
                <Link href="/links">My links</Link>
              </li>
              <li>
                <Link href="/logout">Logout</Link>
              </li>
            </ul>
          </li>
        )
        : (
          <li>
            <Link href="/login">
              <a className={styles.rightMenuItem}>👤 Login</a>
            </Link>
            <ul className={styles.dropdown}>
              <li>Login with Google</li>
              <li>Login with Github</li>
            </ul>
          </li>
        )}
    </ul>
  </div>
);
