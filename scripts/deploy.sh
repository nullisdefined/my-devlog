#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 현재 날짜 가져오기
DATE=$(date +%Y-%m-%d)

echo -e "${YELLOW}Starting blog deployment process...${NC}"

# Obsidian 동기화
echo -e "${GREEN}Syncing blog posts...${NC}"
npm run sync

# Git 상태 확인
if [ -n "$(git status --porcelain)" ]; then
	# 변경사항이 있는 경우
	echo -e "${GREEN}Changes detected, checking what to commit...${NC}"

	# 블로그 포스트 관련 파일만 확인
	BLOG_CHANGES=$(git status --porcelain | grep -E "(src/content/posts/|public/sitemap)" | wc -l)
	OTHER_CHANGES=$(git status --porcelain | grep -v -E "(src/content/posts/|public/sitemap)" | wc -l)

	if [ $BLOG_CHANGES -gt 0 ]; then
		echo -e "${GREEN}Blog post changes detected, committing blog content...${NC}"
		# 블로그 포스트와 사이트맵만 커밋
		git add src/content/posts/
		git add public/sitemap*.xml
		git commit -m "Update blog posts ($DATE)"
		git push

		if [ $OTHER_CHANGES -gt 0 ]; then
			echo -e "${YELLOW}Warning: Other files have changes but were not committed:${NC}"
			git status --porcelain | grep -v -E "(src/content/posts/|public/sitemap)"
			echo -e "${YELLOW}Please review and commit these separately if needed.${NC}"
		fi
	else
		echo -e "${YELLOW}No blog post changes detected, but other files changed:${NC}"
		git status --porcelain
		echo -e "${YELLOW}Please review and commit manually if needed.${NC}"
		exit 0
	fi

	# 빌드 및 sitemap 생성
	echo -e "${GREEN}Building site and generating sitemap...${NC}"
	npm run build

	# RSS 피드 업데이트 및 캐시 무효화
	echo -e "${GREEN}Updating RSS feeds and clearing cache...${NC}"
	node scripts/update-rss.js

	# 사이트맵 재생성 (SEO 최적화)
	echo -e "${GREEN}Regenerating optimized sitemap...${NC}"
	npx next-sitemap

	# 사이트맵 통계 출력
	SITEMAP_SIZE=$(wc -c <public/sitemap-0.xml 2>/dev/null || echo "0")
	URL_COUNT=$(grep -c "<url>" public/sitemap-0.xml 2>/dev/null || echo "0")
	echo -e "${GREEN}📊 사이트맵 통계: ${URL_COUNT}개 URL, ${SITEMAP_SIZE} bytes${NC}"

	# Google과 Bing에 sitemap 알림 (SEO 최적화)
	echo -e "${GREEN}Notifying search engines about sitemap update...${NC}"

	# Google Search Console 알림
	echo -e "${GREEN}  📍 Google Search Console...${NC}"
	GOOGLE_RESPONSE=$(curl -s -w "%{http_code}" -X GET "https://www.google.com/ping?sitemap=https://nullisdefined.site/sitemap.xml")
	if [[ "$GOOGLE_RESPONSE" == *"200" ]]; then
		echo -e "${GREEN}  ✅ Google 알림 성공${NC}"
	else
		echo -e "${YELLOW}  ⚠️ Google 알림 응답: $GOOGLE_RESPONSE${NC}"
	fi

	# Bing Webmaster Tools 알림
	echo -e "${GREEN}  📍 Bing Webmaster Tools...${NC}"
	BING_RESPONSE=$(curl -s -w "%{http_code}" -X GET "https://www.bing.com/ping?sitemap=https://nullisdefined.site/sitemap.xml")
	if [[ "$BING_RESPONSE" == *"200" ]]; then
		echo -e "${GREEN}  ✅ Bing 알림 성공${NC}"
	else
		echo -e "${YELLOW}  ⚠️ Bing 알림 응답: $BING_RESPONSE${NC}"
	fi

	echo -e "${GREEN}Deployment completed successfully!${NC}"
else
	# 변경사항이 없는 경우
	echo -e "${YELLOW}No changes detected${NC}"
fi
