#!/bin/bash
set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting blog publish prep process...${NC}"

# Obsidian 동기화
echo -e "${GREEN}Syncing blog posts...${NC}"
npm run sync

# Git 상태 확인
if [ -n "$(git status --porcelain)" ]; then
	# 변경사항이 있는 경우
	echo -e "${GREEN}Changes detected, checking blog-generated files...${NC}"

	# 블로그 포스트 관련 파일만 확인
	BLOG_CHANGES=$(git status --porcelain | grep -E "(src/content/posts/|public/sitemap)" | wc -l)
	OTHER_CHANGES=$(git status --porcelain | grep -v -E "(src/content/posts/|public/sitemap)" | wc -l)

	if [ $BLOG_CHANGES -gt 0 ]; then
		# 빌드 및 sitemap 생성
		echo -e "${GREEN}Building site and generating sitemap...${NC}"
		npm run build

		# 사이트맵 통계 출력
		SITEMAP_SIZE=$(wc -c <public/sitemap-0.xml 2>/dev/null || echo "0")
		URL_COUNT=$(grep -c "<url>" public/sitemap-0.xml 2>/dev/null || echo "0")
		echo -e "${GREEN}Sitemap stats: ${URL_COUNT} URLs, ${SITEMAP_SIZE} bytes${NC}"

		echo -e "${GREEN}Blog content and sitemap are ready for manual review.${NC}"
		echo -e "${YELLOW}Commit/push are intentionally not run by this script.${NC}"
		echo -e "${YELLOW}Review changes, then commit and push separately when ready.${NC}"

		if [ $OTHER_CHANGES -gt 0 ]; then
			echo -e "${YELLOW}Warning: Other files also have changes:${NC}"
			git status --porcelain | grep -v -E "(src/content/posts/|public/sitemap)"
			echo -e "${YELLOW}Review these separately before committing.${NC}"
		fi
	else
		echo -e "${YELLOW}No blog post changes detected, but other files changed:${NC}"
		git status --porcelain
		echo -e "${YELLOW}Review and commit manually if needed.${NC}"
		exit 0
	fi

	echo -e "${GREEN}Publish prep completed. Google will discover the sitemap after the changes are deployed.${NC}"
else
	# 변경사항이 없는 경우
	echo -e "${YELLOW}No changes detected${NC}"
fi
