import { PostContentEnhancer } from "./post-content-enhancer";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="post-content"
      />
      <PostContentEnhancer />
    </>
  );
}
