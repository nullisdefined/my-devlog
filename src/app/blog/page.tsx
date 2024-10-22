import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { Card } from "@/components/ui/card";

const dummyPosts = Array.from({ length: 10 }, (_, i) => ({
  title: `블로그 포스트 ${i + 1}`,
  description:
    "이것은 더미 블로그 포스트입니다. 실제 콘텐츠는 나중에 추가될 예정입니다.",
  category: "Backend",
  date: "2024-03-15",
  readingTime: "5 min read",
}));

export default function DevlogPage() {
  return (
    <DevlogLayout>
      <div className="space-y-8">
        {dummyPosts.map((post, idx) => (
          <Card key={idx} className="p-6">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {post.category} • {post.date} • {post.readingTime}
              </div>
              <h2 className="text-2xl font-bold">{post.title}</h2>
              <p className="text-muted-foreground">{post.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </DevlogLayout>
  );
}
