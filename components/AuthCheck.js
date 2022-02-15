import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "@/lib/context";

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <>
          <h2>You must be signed in!</h2>

          <Link href="/enter">
            <a>
              <button className="btn-blue">Sign in</button>
            </a>
          </Link>
        </>
      );
}