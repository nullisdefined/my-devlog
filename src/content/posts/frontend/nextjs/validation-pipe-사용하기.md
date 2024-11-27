---
title: "Validation Pipe 사용하기"
date: 2024-11-26
tags: []
category: "Frontend/Next.js"
thumbnail: ""
draft: true
---

HTTP Request 구조
Start line
POST /messages/5?validate=true HTTP/1.1
Headers
Host:localhost:3000
Content-Type: application/json
Body
{"content": "hi there"}

@Param('id')
@Query()
@Headers()
@Body()

@nestjs/common 라이브러리로 부터 임포트할 수 있다