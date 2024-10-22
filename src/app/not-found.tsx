import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">
          요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Link href="/devlog" className="text-primary hover:underline">
          블로그 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
