// 블로그 포스팅 관련 함수들 (파싱, 조회 등)

export async function getPostList() {
  return [
    {
      category: "category1",
      slug: "slug1",
    },
    {
      category: "category2",
      slug: "slug2",
    },
  ];
}
