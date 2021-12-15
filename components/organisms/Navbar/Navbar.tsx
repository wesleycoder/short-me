import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { dbClient } from "../../../db/db";

type anyFnReturn = any | void | Promise<any | void>;

type Props = {
  onLogin?: (provider: string) => anyFnReturn;
  onLogout?: () => anyFnReturn;
};

export const Navbar = ({ onLogin = async () => {} }: Props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = dbClient.auth.user();
    setIsLoggedIn(Boolean(user));
  }, []);

  return (
    <div className={styles.navbar}>
      <Link href="/" passHref>
        <a className={styles.logo} title="Short me">
          🩳 Short me
        </a>
      </Link>
      <ul className={styles.rightMenu}>
        {isLoggedIn ? (
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
        ) : (
          <li>
            <span className={styles.rightMenuItem}>👤 Login</span>
            <ul className={styles.dropdown}>
              <li>
                <button
                  className={styles.rightMenuItem}
                  onClick={async () => {
                    await onLogin("google");
                    setIsLoggedIn(true);
                  }}
                >
                  Login with Google
                </button>
              </li>
              <li>
                <button
                  className={styles.rightMenuItem}
                  onClick={async () => {
                    await onLogin("github");
                    setIsLoggedIn(true);
                  }}
                >
                  Login with Github
                </button>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};
