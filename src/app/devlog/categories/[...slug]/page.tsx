import { Post } from "@/types/index";
import { getPostList } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/devlog/post-card";
import { Pagination } from "@/components/devlog/pagination";
import { categories, CategoryItem } from "@/config/categories";
import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { SortButton } from "@/components/devlog/sort-button";

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = [];

  const addCategoryPath = (category: string) => {
    const normalizedPath = category
      .replace("/devlog/categories/", "")
      .replace(/^\/+|\/+$/g, "")
      .split("/")
      .filter(Boolean);

    paths.push({ slug: normalizedPath });
  };

  categories.forEach((cat) => {
    addCategoryPath(cat.path);
    cat.subcategories?.forEach((subcat) => {
      addCategoryPath(subcat.path);
    });
  });

  return paths;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams: {
    page?: string;
    order?: "asc" | "desc";
  };
}) {
  const categoryPath = params.slug.join("/").toLowerCase();
  const allPosts = await getPostList();
  const order = searchParams.order || "desc";

  const categoryPosts = allPosts
    .filter((post) => {
      const postCategory =
        post.urlCategory?.toLowerCase() || post.category?.toLowerCase();
      return categoryPath === "all"
        ? true
        : postCategory === categoryPath ||
            postCategory?.startsWith(`${categoryPath}/`);
    })
    .sort((a, b) => {
      const comparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      return order === "asc" ? comparison : -comparison;
    });

  const findCategory = (path: string): CategoryItem | null => {
    const findInCategories = (
      cats: readonly CategoryItem[]
    ): CategoryItem | null => {
      for (const cat of cats) {
        const catPath = cat.path
          .toLowerCase()
          .replace("/devlog/categories/", "");
        if (catPath === path) return cat;
        if (cat.subcategories) {
          const found = findInCategories(cat.subcategories);
          if (found) return found;
        }
      }
      return null;
    };
    return findInCategories(categories);
  };

  const currentCategory = findCategory(categoryPath);

  if (!currentCategory) {
    notFound();
  }

  const Icon = currentCategory.icon;
  const currentPage = Number(searchParams.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(categoryPosts.length / postsPerPage);

  const currentPosts = categoryPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <DevlogLayout posts={allPosts}>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Icon className="w-6 h-6" />
            <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              {categoryPosts.length}{" "}
              {categoryPosts.length === 1 ? "Post" : "Posts"} found
            </p>
            <SortButton order={order} />
          </div>
        </div>

        {categoryPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {currentPosts.map((post: Post) => (
                <PostCard
                  key={`${post.urlCategory}/${post.slug}`}
                  post={post}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No posts in this category yet.
          </div>
        )}
      </div>
    </DevlogLayout>
  );
}
