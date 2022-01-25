import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const user = true;
  const username = true;

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
