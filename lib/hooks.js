//1. Fetch user from database
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    //turn off realtime subscription
    let unsubscribe;
    if (user) {
      unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
        setUsername(doc.data()?.username);
      });
    }

    if (!user) {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
