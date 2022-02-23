import styles from "../../styles/Post.module.css";
import PostContent from "@/components/PostContent";
import { getUserWithUsername, firestore } from "@/lib/firebase";
import { postToJSON } from "@/lib/helpers";
import {
  collectionGroup,
  getDocs,
  query as firebaseQuery,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Link from "next/link";
import AuthCheck from "@/components/AuthCheck";
import HeartButton from "../../components/HeartButton";

export default function Post(props) {
  const [post, setPost] = useState(props.post);
  const { slug, id } = props.path;

  const postRef = doc(firestore, "users", id, "posts", slug);

  const unsub = onSnapshot(postRef, (doc) => {
    setPost(postToJSON(doc));
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

        <AuthCheck
          fallback={
            <Link href="/enter">
              <a>
                <button> ❤️ Sign Up</button>
              </a>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>

        <Link href={`/admin/${post.slug}`}>
          <a>
            <button className="btn-green">Edit Post</button>
          </a>
        </Link>
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
    const postsRef = doc(firestore, "users", userDoc.id, "posts", slug);

    const res = await getDoc(postsRef);

    post = postToJSON(res);
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
