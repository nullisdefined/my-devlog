// src/components/blog/layout/blog-sidebar.tsx
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function BlogSidebar() {
  const categories = [
    { name: "All", path: "/blog" },
    { name: "Backend", path: "/blog/backend" },
    { name: "Architecture", path: "/blog/architecture" },
    { name: "Database", path: "/blog/database" },
    { name: "DevOps", path: "/blog/devops" },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-4">
        <Link href="/">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src="https://storage.googleapis.com/hotsix-bucket/KakaoTalk_20241022_185833320.jpg"
              alt="Profile"
            />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
        </Link>
        <div className="text-center">
          <h3 className="font-semibold">Jaewoo Kim</h3>
          <p className="text-sm text-muted-foreground">Backend Developer</p>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold mb-4">Categories</h4>
        <nav className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.path}
              className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
