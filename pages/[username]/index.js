import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { firestore, getUserWithUsername } from "@/lib/firebase";
import {
  listCollections,
  collection,
  doc,
  query as firebaseQuery,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername("goliath");

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsRef = collection(firestore, "users", userDoc.id, "posts");

    const postsQuery = firebaseQuery(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }

  return {
    props: { user, posts },
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

//Convert to json

export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.createdAt.toMillis(),
  };
}
