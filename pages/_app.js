import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "@/lib/context";
import { auth, firestore } from "@/lib/firebase";

//1. Fetch user from database
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

function MyApp({ Component, pageProps }) {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    //turn off realtime subscription
    let unsubscribe;
    if (user) {
      // const ref = collection(firestore, "users").doc(user.uid);
      // unsubscribe = ref.onSnapshot((doc) => setUsername(doc.data?.username));
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        // setUsername(doc.data?.username)
        console.log(doc.data?.username);
      });
    }

    if (!user) {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return (
    <UserContext.Provider value={{ user, username }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
