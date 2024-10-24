import { Post } from "@/types/index";

export function searchPosts(posts: Post[], query: string): Post[] {
  const searchQuery = query.toLowerCase();
  console.log("Starting search with query:", searchQuery);

  return posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(searchQuery);
    const contentMatch = post.content?.toLowerCase().includes(searchQuery);
    const tagsMatch = post.tags?.some((tag) =>
      tag.toLowerCase().includes(searchQuery)
    );

    console.log("Post:", post.title);
    console.log("Title match:", titleMatch);
    console.log("Content match:", contentMatch);
    console.log("Tags match:", tagsMatch);

    return titleMatch || contentMatch || tagsMatch;
  });
}
