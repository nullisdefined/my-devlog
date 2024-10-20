import Link from "next/link";

// 임시 데이터
const posts = [
  { id: 1, title: "First Post", slug: "first-post" },
  { id: 2, title: "Second Post", slug: "second-post" },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link
              href={`/blog/category1/${post.slug}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
