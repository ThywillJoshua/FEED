import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { firestore, getUserWithUsername } from "@/lib/firebase";
import {
  collection,
  query as firebaseQuery,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { postToJSON } from "@/lib/helpers";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

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
