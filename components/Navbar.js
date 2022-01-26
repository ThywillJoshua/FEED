import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@/lib/context";
import { signOutUser } from "@/lib/firebase";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/" passHref>
            <a>
              <button className="btn-logo">FEED</button>
            </a>
          </Link>
        </li>

        {/* user is signed in and has a username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/" passHref>
                <a>
                  <button onClick={signOutUser}>Sign Out</button>
                </a>
              </Link>
            </li>

            <li>
              <Link href="/admin" passHref>
                <a>
                  <button className="btn-blue">Write Posts</button>
                </a>
              </Link>
            </li>

            <li>
              <Link href={`/${username}`} passHref>
                <a>
                  <Image
                    className="img"
                    width={50}
                    height={50}
                    src={user?.photoURL || "/user.png"}
                    alt="profile"
                  />
                </a>
              </Link>
            </li>
          </>
        )}

        {/* user is not signed in and has a username */}
        {!username && (
          <>
            <li className="push-left">
              <Link href="/enter" passHref>
                <a>
                  <button className="btn-blue">Log in</button>
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
