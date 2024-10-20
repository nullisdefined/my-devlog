import Layout from "../../components/Layout";
import PostList from "../../components/PostList";
import { Post } from "../../types";

interface BlogPageProps {
  posts: Post[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Layout title="Blog">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <PostList posts={posts} />
    </Layout>
  );
}

// 여기에 getStaticProps 함수를 추가하여 실제 블로그 포스트 데이터를 가져올 수 있습니다.
