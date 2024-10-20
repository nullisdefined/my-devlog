import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">Welcome to My Blog</h1>
      <Link href="/blog" className="text-blue-500 hover:underline">
        View Blog Postsㅋㅋㅋ
      </Link>
    </main>
  );
}
