import Link from "next/link";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={post.coverImage}
        alt={post.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        <Link
          href={`/blog/${post.slug}`}
          className="text-blue-500 hover:underline"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
