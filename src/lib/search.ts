import { Post } from "@/types/post";

export function searchPosts(posts: Post[], query: string): Post[] {
  const searchQuery = query.toLowerCase();

  return posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchQuery);
    const contentMatch = post.content?.toLowerCase().includes(searchQuery);
    const tagsMatch = post.tags?.some((tag) =>
      tag.toLowerCase().includes(searchQuery)
    );
    const descriptionMatch = post.description
      ?.toLowerCase()
      .includes(searchQuery);

    return titleMatch || contentMatch || tagsMatch || descriptionMatch;
  });
}
