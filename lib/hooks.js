//1. Fetch user from database
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useUserData() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      const unsubscribe = onSnapshot(
        doc(firestore, "users", user.uid),
        (doc) => {
          setUsername(doc.data()?.username);
        }
      );
    } else {
      setUser(null);
      setUsername(null);
    }
  });

  // useEffect(() => {
  //   //turn off realtime subscription
  //   let unsubscribe;
  //   if (user) {
  //     unsubscribe = onSnapshot(doc(firestore, "users", user.uid), (doc) => {
  //       setUsername(doc.data()?.username);
  //     });
  //   }

  //   if (!user) {
  //     setUsername(null);
  //   }

  //   return unsubscribe;
  // }, [user]);

  return { user, username };
}
