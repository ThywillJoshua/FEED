import { signOutUser, signInWithGoogle } from "@/lib/firebase";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@/lib/context";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  //1. user signed out <SignInButton/>
  //2. user signed in, but missing username <UsernameForm/>
  //3. user signed in & has username <SignOutButton/>

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

//sign in with Google button
function SignInButton() {
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <Image
        src="/google.png"
        alt="google"
        className="img"
        width={20}
        height={20}
      />
      Sign In with Google
    </button>
  );
}

//sign out6 with Google button
function SignOutButton() {
  return (
    <button className="btn-google" onClick={signOutUser}>
      Sign Out
    </button>
  );
}

//select username
function UsernameForm() {
  return <></>;
}
