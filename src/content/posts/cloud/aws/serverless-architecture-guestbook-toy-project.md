---
title: "서버리스 아키텍처로 구현한 방명록 토이프로젝트"
slug: "serverless-architecture-guestbook-toy-project"
date: 2025-06-25
tags: ["AWS", "Serverless", "Lambda", "APIGateway", "DynamoDB", "CloudWatch", "ToyProject"]
category: "Cloud/AWS"
thumbnail: "https://github.com/user-attachments/assets/e15141e0-185d-4b98-981a-c9dc7886bf0a"
draft: false
views: 0
---
서버리스 아키텍처를 학습하고 난 후, 배운 내용을 직접 적용해보고 싶어서 간단한 웹 방명록 서비스를 만들어보았다. 포스트잇 스타일로 방문자들이 자유롭게 메시지를 남길 수 있는 애플리케이션이다.

## 프로젝트 개요

**포스트잇 스타일 방명록 서비스** - 사용자들이 다양한 색상의 포스트잇에 닉네임과 메시지를 남길 수 있는 웹 애플리케이션을 구현했다. 프로젝트 구현 결과는 [nullisdefined.github.io/guestboots](https://nullisdefined.github.io/guestboots/)에서 확인할 수 있다.

## 아키텍처 설계

AWS 서버리스 환경으로 구성하여 서버 관리 부담과, 프리티어 계정을 활용한 비용 부담을 없앴다.

### 프론트엔드: GitHub Pages

처음에는 S3에 정적 웹사이트를 호스팅하려고 했지만, 결국 GitHub Pages로 호스팅하였다. 다음과 같은 이점들 때문이다.

- **배포 자동화**: 코드 수정 시 GitHub Actions 자동 배포
- **도메인 관리**: GitHub에서 제공하는 도메인 사용 가능
- **비용**: 무료

기술 스택은 순수 HTML/CSS/JavaScript로 구성한 SPA(Single Page Application)다.

### 백엔드: AWS 서버리스 서비스

![Serverless Architecture Overview](https://github.com/user-attachments/assets/e15141e0-185d-4b98-981a-c9dc7886bf0a)
*Serverless Architecture Overview*

#### 1. API Gateway
RESTful API 엔드포인트를 제공하는 진입점 역할을 한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/e289155fd20bbb9e748086284c6e75d8.png)
*API Gateway 리소스들 - GET, POST, OPTIONS 메서드 설정*

- **엔드포인트**: `https://zzgm438ccd.execute-api.ap-northeast-2.amazonaws.com/prod`
- **지원 메서드**: 
  - `GET /notes`: 방명록 데이터 조회
  - `POST /notes`: 새로운 방명록 작성
  - `OPTIONS /notes`: CORS preflight 요청 처리

OPTIONS 메서드는 처음에 무엇인지 몰랐는데, 브라우저가 CORS 정책을 확인하기 위해 실제 요청 전에 보내는 preflight 요청을 처리하는 용도였다.

#### 2. AWS Lambda
비즈니스 로직을 처리하는 핵심 컴포넌트로 두 개의 함수를 구현했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1d6e7756d9c9a2adf34aa1f0dd711c68.png)
*Lambda 함수들 → get-notes와 create-note*

**guestboots-get-notes 함수**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-2" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });
        
        const result = await docClient.send(command);
        
        // created_at으로 정렬 (최신순)
        const sortedItems = result.Items.sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(sortedItems)
        };
        
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
```

**guestboots-create-note 함수**

```javascript
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-northeast-2" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

// 자체 UUID 생성 함수
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };
    
    // OPTIONS 요청 처리 (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    try {
        // 요청 본문 파싱
        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (parseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Invalid JSON in request body'
                })
            };
        }
        
        const { nickname, content } = body;
        
        // 입력 검증
        if (!nickname || !content) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'nickname and content are required'
                })
            };
        }
        
        // 새 메모 생성
        const noteId = generateUUID();
        const timestamp = new Date().toISOString();
        
        const item = {
            id: noteId,
            nickname: nickname.trim(),
            content: content.trim(),
            created_at: timestamp
        };
        
        // DynamoDB에 저장
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        });
        
        await docClient.send(command);
        
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({
                message: 'Note created successfully',
                note: item
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
```

UUID 생성을 위해 처음에는 uuid 라이브러리를 패키징해서 Lambda Layer로 업로드하려고 했지만, 번거로워서 직접 구현한 간단한 UUID 생성 함수를 사용했다.

#### 3. DynamoDB
방명록 데이터를 저장하는 NoSQL 데이터베이스다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/27feff058cc50498c5ac4b4ace819464.png)
*DynamoDB guestboots-notes 테이블 생성*

- **테이블명**: `guestboots-notes`
- **파티션 키**: `id` (String)
- **정렬 키**: 없음 (단순한 구조로 설계)

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/dc30920e6656d21c0b977e4f61772503.png)
*DynamoDB 테이블에 저장된 방명록 데이터*

#### 4. CloudWatch
Lambda 함수의 로그 모니터링을 위해 사용했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/cce2dd83951b217308f45d56a75ede0b.png)
*CloudWatch에서 확인할 수 있는 Lambda 함수 실행 로그*

디버깅과 모니터링에 매우 유용했다. 특히 API 요청이 실패했을 때 어느 부분에서 문제가 발생했는지 쉽게 파악할 수 있었다.

## 프론트엔드

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/9465fdbf6adc56b58d33de26befe4515.png)
*페이지 화면 (누군가 인사를 남겼네요 안녕하세요)*

### 포스트잇 스타일 UI
- **6가지 색상**: yellow, pink, blue, green, orange, purple
- **포스트잇스럽게 표현**: 랜덤으로 회전
- **기타**: 호버 효과

### 방명록 작성 기능
- **모달 팝업**
- **입력 제한**: 닉네임 최대 20자, 내용 최대 200자

### 방명록 조회 기능
- **그리드 레이아웃**
- **시간 정보**: 작성일자 표시

## 개발 과정에서의 인사이트

### 서버리스의 장점을 체감
이번 프로젝트를 통해 서버리스 아키텍처의 매력을 직접 경험할 수 있었다.

**비용 효율성**: 요청이 있을 때만 Lambda가 실행되어 비용이 발생한다. 프리티어 기준으로 월 몇만 건의 요청까지 무료이고, 그 이후에도 전통적인 서버 대비 비용이 훨씬 저렴하다.

**자동 스케일링**: 동시에 여러 요청이 들어와도 AWS가 자동으로 확장해준다. 트래픽 급증에 대한 걱정이 없다.

**관리 부담 감소**: 서버 패치, 업데이트, 모니터링 등의 인프라 관리가 필요 없다.

### 서버리스의 한계점과 디버깅 이슈
하지만 일반적인 백엔드 애플리케이션과 비교했을 때 고려사항들도 있었다.

**API 규모의 문제**: 평소 NestJS로 백엔드를 개발할 때는 보통 수십 개의 API 엔드포인트를 만드는데, 각각을 별도의 Lambda 함수로 구성하는 것이 현실적인지 의문이 들었다. 물론 프로젝트 규모나 요구사항에 따라 다르겠지만, 복잡한 애플리케이션에서는 어떤 방식으로 서버리스를 적용하는지 더 알아볼 필요가 있다고 생각했다.

**디버깅의 어려움**: 가장 고생했던 부분은 바로 디버깅이었다. Lambda 함수의 동기적 특성 때문에 클라이언트 측에서 에러 정보를 파악하기 어려웠다. 

실제로 개발 과정에서 프론트엔드에서 API를 호출했을 때 개발자 도구 콘솔에 501 에러만 표시되고, 구체적인 에러 원인을 전혀 알 수 없었다. 일반적인 Express.js 서버라면 서버 콘솔에서 바로 에러 로그를 확인할 수 있는데, Lambda에서는 그렇지 못 했다.

결국 AWS 콘솔의 CloudWatch를 통해 문제를 해결할 수 있었는데.. CloudWatch에서 자세한 실행 로그를 확인한 결과, Node.js Lambda 함수를 생성할 때 자동으로 `index.mjs` 파일이 생성되는데, 나는 여기에 CommonJS 방식인 `require`를 사용해서 코드를 작성했던 것이 문제였다. `.mjs` 확장자는 ES Module 형식을 요구하는데 `import/export` 구문을 사용해야 했다.

```javascript
// 잘못된 방식 (CommonJS)
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

// 올바른 방식 (ES Module)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
```

별 것 아닌 문제로 시간을 꽤 소비했지만, 덕분에 CloudWatch의 중요함을 깨달을 수 있었다. 서버리스 환경에서는 CloudWatch가 중요한 디버깅 도구라는 것을 배웠다.

## 마무리

첫 서버리스 프로젝트를 통해 클라우드 네이티브 개발의 새로운 경험할 수 있었다. 특히 인프라 관리에 신경 쓰지 않고 비즈니스 로직에만 집중할 수 있다는 점이 매우 인상적이었다.

앞으로는 더 복잡한 서버리스 아키텍처 패턴들을 학습하고, 실제 프로덕션 환경에서 어떻게 서버리스를 효과적으로 활용할 수 있는지 학습해보고 싶다.

이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/guestboots)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.