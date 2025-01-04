import { getPostsByTag, getPostList, getAllTags } from "@/lib/posts";
import { notFound } from "next/navigation";
import { TagView } from "@/components/devlog/tag-view";

interface TagPageProps {
  params: {
    tags: string;
  };
  searchParams: {
    order?: "asc" | "desc";
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();

  return tags.map((tag) => ({
    tags: tag,
  }));
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const order = searchParams.order || "desc";
  const decodedTag = decodeURIComponent(params.tags);

  const [taggedPosts, allPosts] = await Promise.all([
    getPostsByTag(decodedTag),
    getPostList(),
  ]);

  if (taggedPosts.length === 0) {
    notFound();
  }

  const sortedPosts = [...taggedPosts].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "asc" ? comparison : -comparison;
  });

  return (
    <TagView sortedPosts={sortedPosts} decodedTag={decodedTag} order={order} />
  );
}
