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
            <button className="btn-logo">FEED</button>
          </Link>
        </li>

        {/* user is signed in and has a username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOutUser}>Sign Out</button>
            </li>

            <li>
              <Link href="/admin" passHref>
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>

            <li>
              <Link href={`/${username}`} passHref>
                <Image
                  className="img"
                  width={50}
                  height={50}
                  src={user?.photoURL || "/user.png"}
                  alt="profile"
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed in and has a username */}
        {!username && (
          <>
            <li className="push-left">
              <Link href="/enter" passHref>
                <button className="btn-blue">Log in</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
