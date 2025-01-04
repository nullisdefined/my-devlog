import { DevlogLayout } from "@/components/devlog/layout/devlog-layout";
import { getPostList } from "@/lib/posts";
import { Metadata } from "next";
import { TocProvider } from "../context/toc-provider";

export const metadata: Metadata = {
  title: {
    default: "Devlog",
    template: "%s | Devlog",
  },
  description:
    "A personal blog dedicated to sharing insights and experiences in software development.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://nullisdefined.site/devlog",
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPostList();
  return (
    <TocProvider>
      <DevlogLayout posts={posts} isListPage={true}>
        {children}
      </DevlogLayout>
    </TocProvider>
  );
}
