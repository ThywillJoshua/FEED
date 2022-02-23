import { collection, increment, updateDoc } from "firebase/firestore";
import { useState } from "react";

export default function Heart({ postRef }) {
  const [heartExists, setHeartExists] = useState(false);

  const addHeart = async (e) => {
    setHeartExists(true);
    const res = await updateDoc(postRef, { heartCount: increment(1) });
  };

  const removeHeart = async (e) => {
    setHeartExists(false);
    await updateDoc(postRef, { heartCount: increment(-1) });
  };

  return heartExists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>♥️ Heart</button>
  );
}
