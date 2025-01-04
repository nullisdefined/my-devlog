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
	echo -e "${GREEN}Changes detected, committing...${NC}"
	git add .
	git commit -m "Update blog posts ($DATE)"
	git push

	# 빌드 및 sitemap 생성
	echo -e "${GREEN}Building site and generating sitemap...${NC}"
	npm run build

	# Google에 sitemap 알림
	echo -e "${GREEN}Notifying Google about sitemap update...${NC}"
	curl -X GET "http://www.google.com/ping?sitemap=https://nullisdefined.site/sitemap.xml"

	echo -e "${GREEN}Deployment completed successfully!${NC}"
else
	# 변경사항이 없는 경우
	echo -e "${YELLOW}No changes detected${NC}"
fi
