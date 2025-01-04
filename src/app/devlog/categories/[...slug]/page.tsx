import { notFound } from "next/navigation";
import { categories, CategoryItem } from "@/config/categories";
import { CategoryView } from "@/components/devlog/category-view";
import { getPostList } from "@/lib/posts";

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

  const currentCategoryWithIconName = {
    ...currentCategory,
    iconName: currentCategory.icon.name,
  };

  const currentPage = Number(searchParams.page) || 1;
  const postsPerPage = 6;
  const totalPages = Math.ceil(categoryPosts.length / postsPerPage);

  const currentPosts = categoryPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <CategoryView
      posts={currentPosts}
      allPosts={allPosts}
      currentCategory={currentCategoryWithIconName}
      order={order}
      categoryPosts={categoryPosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
