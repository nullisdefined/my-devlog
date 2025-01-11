import { getPostBySlug, getPostList } from "@/lib/posts";
import { markdownToHtml, extractTableOfContents } from "@/lib/markdown";
import { notFound } from "next/navigation";
import { PostView } from "@/components/devlog/post-view";

interface PostPageProps {
  params: {
    slug: string[];
  };
  searchParams: {
    page?: string;
    order?: "asc" | "desc";
  };
}

export async function generateStaticParams() {
  const posts = await getPostList();

  return posts.map((post) => ({
    slug: [...(post.urlCategory?.split("/").filter(Boolean) || []), post.slug],
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const slug = params.slug[params.slug.length - 1];
  const category = params.slug.slice(0, -1).join("/");
  const post = await getPostBySlug(category.toLowerCase(), slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const canonicalPath = `https://nullisdefined.site/devlog/posts/${params.slug.join(
    "/"
  )}`;

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - Devlog`,
    alternates: {
      canonical: canonicalPath,
    },
  };
}

export default async function PostPage({
  params,
  searchParams,
}: PostPageProps) {
  const slug = params.slug[params.slug.length - 1];
  const category = params.slug.slice(0, -1).join("/");

  const post = await getPostBySlug(category.toLowerCase(), slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content || "");
  const toc = extractTableOfContents(content);

  return <PostView post={post} content={content} toc={toc} />;
}
