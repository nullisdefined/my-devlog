import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DevlogSidebar() {
  const categories = [
    { name: "All", path: "/devlog" },
    { name: "Backend", path: "/devlog/backend" },
    { name: "Architecture", path: "/devlog/architecture" },
    { name: "Database", path: "/devlog/database" },
    { name: "DevOps", path: "/devlog/devops" },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Section */}
      <div className="flex flex-col items-center space-y-4">
        <Link href="/">
          <Avatar className="h-32 w-32 border-2 border-primary/20">
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
      <div className="text-center">
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
