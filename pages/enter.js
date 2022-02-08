import { signOutUser, signInWithGoogle, firestore } from "@/lib/firebase";
import Image from "next/image";
import { useContext, useEffect, useCallback, useState } from "react";
import { UserContext } from "@/lib/context";
import Loader from "@/components/Loader";
import { writeBatch, doc, getDoc } from "firebase/firestore";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

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

//sign out with Google button
function SignOutButton() {
  return (
    <button className="btn-google" onClick={signOutUser}>
      Sign Out
    </button>
  );
}

//select username
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  const onChangeHandler = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, "usernames", username);
        const snap = await getDoc(ref);

        setIsValid(!snap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const userDoc = doc(firestore, "users", user.uid);
      const usernameDoc = doc(firestore, "usernames", formValue);

      const batch = writeBatch(firestore);

      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });

      batch.set(usernameDoc, {
        uid: user.uid,
      });

      await batch.commit();
    } catch (error) {
      toast.error("Couldn't complete sign in process ");
      console.error(error.message);
    }
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>

        <form onSubmit={onSubmitHandler}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChangeHandler}
            autoComplete="off"
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username:{formValue} <br /> Loading: {loading.toString()} <br />{" "}
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <Loader show={loading} />;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
