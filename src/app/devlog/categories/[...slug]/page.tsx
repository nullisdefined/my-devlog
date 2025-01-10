import { notFound } from "next/navigation";
import { categories, CategoryItem } from "@/config/categories";
import { CategoryView } from "@/components/devlog/category-view";
import { getPostList } from "@/lib/posts";
import { InfiniteScrollPosts } from "@/components/devlog/infinite-scroll-posts";

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

  if (!currentCategory || categoryPosts.length === 0) {
    notFound();
  }

  const categoryForClient = {
    name: currentCategory.name,
    path: currentCategory.path,
    iconName: currentCategory.icon.name,
    description: currentCategory.description,
  };

  return (
    <div className="space-y-8">
      <CategoryView
        posts={categoryPosts}
        allPosts={allPosts}
        currentCategory={categoryForClient}
        order={order}
        categoryPosts={categoryPosts}
        currentPage={1}
        totalPages={Math.ceil(categoryPosts.length / 10)}
      />
      {/* <InfiniteScrollPosts
        initialPosts={categoryPosts.slice(0, 6)}
        allPosts={categoryPosts}
        order={order}
      /> */}
    </div>
  );
}
