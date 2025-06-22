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

	# Google과 Bing에 sitemap 알림
	echo -e "${GREEN}Notifying search engines about sitemap update...${NC}"
	curl -X GET "http://www.google.com/ping?sitemap=https://nullisdefined.site/sitemap.xml"
	curl -X GET "http://www.bing.com/ping?sitemap=https://nullisdefined.site/sitemap.xml"

	echo -e "${GREEN}Deployment completed successfully!${NC}"
else
	# 변경사항이 없는 경우
	echo -e "${YELLOW}No changes detected${NC}"
fi
