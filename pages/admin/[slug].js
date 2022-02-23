import AuthCheck from "@/components/AuthCheck";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore, serverTimestamp } from "@/lib/firebase";
import { UserContext } from "@/lib/context";
import styles from "../../styles/Admin.module.css";
import ImageUploader from "@/components/ImageUploader";

export default function AdminPostEdit({ posts }) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const [post, setPost] = useState(null);

  const router = useRouter();
  const { slug } = router.query;

  const { username } = useContext(UserContext);
  const postRef = doc(firestore, "users", auth.currentUser.uid, "posts", slug);

  if (username) {
    async function getPost() {
      const docSnap = await getDoc(postRef);

      if (docSnap.exists()) {
        const doc = docSnap.data();
        setPost(doc);
      }
    }

    getPost();
  }

  if (post === null) {
    return (
      <>
        <h1>no posts</h1>
      </>
    );
  }

  return (
    <>
      <main className={styles.container}>
        {post.title && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>

              <PostForm
                postRef={postRef}
                defaultValues={post}
                preview={preview}
              />
            </section>

            <aside>
              <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>
                {preview ? "Edit" : "Preview"}
              </button>

              <Link href={`/${post.username}/${post.slug}`}>
                <a>
                  <button className="btn-blue">Live view</button>
                </a>
              </Link>
            </aside>
          </>
        )}
      </main>
    </>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    try {
      await updateDoc(postRef, {
        content,
        published,
        updatedAt: serverTimestamp(),
      });

      reset({ content, published });

      toast.success("Successfully Updated");
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <textarea
          name="content"
          {...register("content", {
            required: "Required",
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
          })}
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <label>
            <small>Publish</small>
            <input
              type="checkbox"
              className={styles.checkbox}
              name="published"
              {...register("published")}
            />
          </label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={errors.content}>
          Save Changes
        </button>
      </div>
    </form>
  );
}
