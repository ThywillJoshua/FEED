import { auth, googleAuthProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import Image from "next/image";
import toast from "react-hot-toast";

export default function EnterPage({}) {
  const user = null;
  const username = null;

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
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      toast.error("Error Sigining In");
      console.error(error.message);
    }
  };

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
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      toast.error("Error Signing Out");
      console.error(error.message);
    }
  };

  return (
    <button className="btn-google" onClick={signOutUser}>
      Sign Out
    </button>
  );
}

//select username
function UsernameForm() {}
