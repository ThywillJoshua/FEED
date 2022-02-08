import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { getUserWithUsername } from "@/lib/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername("johndoe");

  let user = null;
  let posts = null;

  //   if (userDoc) {
  //     user = userDoc.data();
  //     const postsQuery = userDoc.ref
  //       .collection("posts")
  //       .where("published", "==", true)
  //       .orderBy("createdAt", "desc")
  //       .limit(5);

  //     posts = (await postsQuery.get()).docs.map(postToJSON);
  //   }

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
    createdAt: data.createdAt.toMilis(),
    updatedAt: data.createdAt.toMilis(),
  };
}
