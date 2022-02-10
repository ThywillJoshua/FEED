import Head from "next/head";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import {
  collectionGroup,
  where,
  orderBy,
  limit,
  query,
  getDocs,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { postToJSON, toTimestamp } from "@/lib/helpers";
import { useState } from "react";
import PostFeed from "@/components/PostFeed";

const LIMIT = 1;

export async function getServerSideProps(context) {
  try {
    const postsQuery = query(
      collectionGroup(firestore, "posts"),
      orderBy("createdAt", "desc"),
      where("published", "==", true),
      limit(LIMIT)
    );

    const posts = [];
    const postsRes = await getDocs(postsQuery);
    postsRes.forEach((doc) => {
      const data = postToJSON(doc);
      posts.push(data);
    });

    return {
      props: { posts },
    };
  } catch (error) {
    console.log(error.message);
    return {
      props: { posts: [] },
    };
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    try {
      setLoading(true);
      const last = posts[posts.length - 1];

      const cursor =
        typeof last.createdAt === `number`
          ? Timestamp.fromMillis(last.createdAt)
          : last.createdAt;

      const postsQuery = query(
        collectionGroup(firestore, "posts"),
        orderBy("createdAt", "desc"),
        where("published", "==", true),
        startAfter(cursor),
        limit(LIMIT)
      );

      const newPosts = [];
      const postsRes = await getDocs(postsQuery);
      postsRes.forEach((doc) => {
        const data = postToJSON(doc);
        newPosts.push(data);
      });

      setPosts(posts.concat(newPosts));
      setLoading(false);

      if (newPosts.length < LIMIT) {
        setPostsEnd(true);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Couldn't fetch more data");
      console.log(error.message);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
