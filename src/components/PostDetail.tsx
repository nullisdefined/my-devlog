import { Post } from "../types";

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="prose lg:prose-xl mx-auto">
      <h1>{post.title}</h1>
      <p className="text-gray-500">Published on {post.date}</p>
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-64 object-cover mb-6"
      />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
