import styles from "../../styles/Post.module.css";
import PostContent from "@/components/PostContent";
import { getUserWithUsername, firestore } from "@/lib/firebase";
import { postToJSON } from "@/lib/helpers";
import {
  collection,
  collectionGroup,
  getDocs,
  query as firebaseQuery,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Post(props) {
  const [post, setPost] = useState(props.post);
  const { slug, id } = props.path;

  const postsRef = collection(firestore, "users", id, "posts");

  const q = firebaseQuery(postsRef, where("slug", "==", slug), limit(1));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push(postToJSON(doc));

      if (posts[0]) {
        setPost(posts[0]);
      }
    });
  });

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>
      </aside>
    </main>
  );
}

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postsRef = collection(firestore, "users", userDoc.id, "posts");

    const postsQuery = firebaseQuery(
      postsRef,
      where("slug", "==", slug),
      limit(1)
    );

    const res = await getDocs(postsQuery);
    const posts = res.docs.map(postToJSON);
    post = posts[0];
    path = { slug: post.slug, id: userDoc.id };
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = firebaseQuery(collectionGroup(firestore, "posts"));

  const paths = [];
  const postsRes = await getDocs(snapshot);
  postsRes.forEach((doc) => {
    const { slug, username } = doc.data();
    paths.push({ params: { username, slug } });
  });

  return {
    paths,
    fallback: "blocking",
  };
}
