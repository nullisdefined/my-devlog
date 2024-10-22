import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BlogHome() {
  // 샘플 블로그 포스트 데이터
  const posts = [
    {
      slug: "post-1",
      title: "첫 번째 블로그 포스트",
      excerpt: "이것은 첫 번째 블로그 포스트의 요약입니다...",
      date: "2024-10-22",
      category: "프론트엔드",
      tags: ["React", "Next.js"],
    },
    // 더 많은 포스트 추가
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <Card key={post.slug}>
          <CardHeader>
            <CardTitle>
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{post.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <span>{post.date}</span>
            <span>{post.category}</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
