import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { auth, firestore } from "@/lib/firebase";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/context";

import {
  doc,
  collection,
  query as firebaseQuery,
  orderBy,
  serverTimestamp,
  setDoc,
  getDocs,
} from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import styles from "../../styles/Admin.module.css";
import { useRouter } from "next/router";

export default function AdminPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const { username } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (username) {
      let ref = collection(firestore, "users", auth.currentUser.uid, "posts");
      const q = firebaseQuery(ref, orderBy("createdAt"));
      //const posts = [];

      async function getPosts() {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          // posts.push(doc.data());
          setPosts((prevPosts) => [...prevPosts, doc.data()]);
        });
      }

      getPosts();
    }
  }, [username]);

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();

  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  //ensure slug is safe and unused
  const slug = encodeURI(kebabCase(title));

  //isValid Length
  const isValid = title.length > 3 && title.length < 100;

  //create a new post
  const createPost = async (e) => {
    e.preventDefault();

    try {
      const uid = auth.currentUser.uid;
      const ref = doc(firestore, "users", auth.currentUser?.uid, "posts", slug);

      const data = {
        title,
        slug,
        uid,
        username,
        published: false,
        content: "# hello world!",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        heartCount: 0,
      };

      const res = await setDoc(ref, data);

      toast.success("Post Created");
    } catch (error) {
      toast.error("Couldn't create post");
      console.error(error.message);
    }

    router.push(`/admin/${slug}`);
  };

  return (
    <>
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article name..."
          className={styles.input}
        />

        <p>
          <strong>Slug:</strong> {slug}
        </p>

        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </form>
    </>
  );
}
