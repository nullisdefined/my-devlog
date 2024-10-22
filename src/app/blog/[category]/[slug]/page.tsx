interface BlogPostParams {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: BlogPostParams) {
  return (
    <article className="prose lg:prose-xl mx-auto">
      <h1>블로그 포스트 제목</h1>
      <div className="text-muted-foreground mb-4">
        <time>2024-10-22</time> • <span>프론트엔드</span>
      </div>
      <div>
        {/* 블로그 포스트 내용 */}
        <p>여기에 블로그 포스트 내용이 들어갑니다...</p>
      </div>
    </article>
  );
}
