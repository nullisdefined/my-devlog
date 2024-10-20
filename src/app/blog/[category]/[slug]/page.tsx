import { getPostList } from "@/src/lib/posts";
import { FC } from "react";

export async function generateStaticParams() {
  const posts = await getPostList();

  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

interface PageProps {
  params: {
    category: string;
    slug: string;
  };
}

const BlogPost: FC<PageProps> = ({ params }) => {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>Category: {params.category}</p>
      <p>Slug: {params.slug}</p>
    </div>
  );
};

export default BlogPost;
