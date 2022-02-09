import Link from "next/link";

export default function PostFeed({ posts }) {
  return (
    posts &&
    posts.map((post) => (
      <PostItem post={post} key={post.slug} admin={"admin"} />
    ))
  );
}

function PostItem({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0); //TODO

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`}>
        <a>
          <h2>{post.title}</h2>
        </a>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span> {post.heartCount} ❤️</span>
      </footer>
    </div>
  );
}
