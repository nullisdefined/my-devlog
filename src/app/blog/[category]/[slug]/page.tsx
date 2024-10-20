import { FC } from "react";

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
