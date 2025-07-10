---
title: "[Jest] 테스팅 프레임워크 기본 사용법"
slug: "jest-basics"
date: 2025-01-15
tags: ["Jest", "Testing", "JavaScript", "TypeScript"]
category: "Uncategorized"
thumbnail: "https://jestjs.io/img/jest.png"
draft: true
views: 0
---

![Jest Testing Framework](https://jestjs.io/img/jest.png)

## Jest란?

Jest는 Facebook(현 Meta)에서 개발한 JavaScript 테스팅 프레임워크다. React 프로젝트에서 기본적으로 사용되며, Node.js 환경에서도 널리 활용된다. "제로 설정(Zero Configuration)"을 목표로 하여 복잡한 설정 없이도 바로 테스트를 시작할 수 있다.

### Jest의 주요 특징

- **제로 설정**: 별도의 설정 없이 바로 사용 가능
- **스냅샷 테스팅**: UI 컴포넌트의 변경사항을 쉽게 추적
- **내장 모킹**: 함수, 모듈, 타이머 등을 쉽게 모킹 가능
- **코드 커버리지**: 테스트가 얼마나 많은 코드를 커버하는지 리포트 제공
- **병렬 실행**: 테스트를 병렬로 실행하여 속도 향상
- **직관적인 API**: `describe`, `it`, `expect` 등 읽기 쉬운 문법

## Jest 설치 및 설정

### 기본 설치

```bash
# npm을 사용하는 경우
npm install --save-dev jest

# yarn을 사용하는 경우
yarn add --dev jest

# TypeScript와 함께 사용하는 경우
npm install --save-dev jest @types/jest ts-jest typescript
```

### TypeScript 설정

TypeScript 프로젝트에서 Jest를 사용하려면 `jest.config.js` 파일을 생성한다.

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### package.json 스크립트 설정

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 기본 테스트 작성법

### 1. 기본 구조

Jest는 `describe`, `it` (또는 `test`), `expect`를 중심으로 한 직관적인 구조를 제공한다.

```js
// math.js - 테스트할 함수들
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, subtract, multiply };
```

```js
// math.test.js - 테스트 파일
const { add, subtract, multiply } = require('./math');

describe('Math functions', () => {
  describe('add', () => {
    it('should add two numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
    });

    it('should handle decimal numbers', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
      expect(subtract(0, 5)).toBe(-5);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers correctly', () => {
      expect(multiply(3, 4)).toBe(12);
      expect(multiply(-2, 3)).toBe(-6);
    });
  });
});
```

### 2. 주요 매처(Matchers)

Jest는 다양한 매처를 제공하여 값을 검증할 수 있다.

```js
describe('Jest matchers examples', () => {
  it('equality matchers', () => {
    expect(2 + 2).toBe(4);                    // 정확한 일치
    expect({ name: 'Jest' }).toEqual({ name: 'Jest' }); // 객체/배열 내용 비교
  });

  it('truthiness matchers', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('Hello').toBeDefined();
  });

  it('number matchers', () => {
    expect(2 + 2).toBeGreaterThan(3);
    expect(3.14).toBeCloseTo(3.1, 1);
  });

  it('string matchers', () => {
    expect('Hello World').toMatch(/World/);
    expect('Jest Testing').toContain('Test');
  });

  it('array and iterable matchers', () => {
    expect(['apple', 'banana', 'orange']).toContain('banana');
    expect(['a', 'b', 'c']).toHaveLength(3);
  });

  it('exception matchers', () => {
    const throwError = () => {
      throw new Error('Something went wrong');
    };
    expect(throwError).toThrow('Something went wrong');
  });
});
```

## 비동기 코드 테스팅

### Promise 테스트

```js
// async-functions.js
function fetchUserData(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({ id: 1, name: 'John Doe' });
      } else {
        reject(new Error('User not found'));
      }
    }, 100);
  });
}

module.exports = { fetchUserData };
```

```js
// async-functions.test.js
const { fetchUserData } = require('./async-functions');

describe('Async functions', () => {
  // Promise를 반환하는 방법
  it('should fetch user data', () => {
    return fetchUserData(1).then(data => {
      expect(data.name).toBe('John Doe');
    });
  });

  // async/await 사용
  it('should fetch user data with async/await', async () => {
    const data = await fetchUserData(1);
    expect(data.name).toBe('John Doe');
  });

  // 에러 케이스 테스트
  it('should throw error for invalid user id', async () => {
    await expect(fetchUserData(999)).rejects.toThrow('User not found');
  });
});
```

### 타이머 모킹

```js
// timer-functions.js
function delayedGreeting(name, delay = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Hello, ${name}!`);
    }, delay);
  });
}

module.exports = { delayedGreeting };
```

```js
// timer-functions.test.js
const { delayedGreeting } = require('./timer-functions');

describe('Timer functions', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // 가짜 타이머 사용
  });

  afterEach(() => {
    jest.useRealTimers(); // 실제 타이머로 복원
  });

  it('should resolve after specified delay', async () => {
    const promise = delayedGreeting('Jest');
    
    // 1초를 빨리 진행
    jest.advanceTimersByTime(1000);
    
    const result = await promise;
    expect(result).toBe('Hello, Jest!');
  });
});
```

## 모킹(Mocking)

### 함수 모킹

```js
// api.js
const axios = require('axios');

async function getUser(id) {
  const response = await axios.get(`/users/${id}`);
  return response.data;
}

module.exports = { getUser };
```

```js
// api.test.js
const axios = require('axios');
const { getUser } = require('./api');

// axios 모듈 전체를 모킹
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch user data', async () => {
    const userData = { id: 1, name: 'John Doe' };
    mockedAxios.get.mockResolvedValue({ data: userData });

    const result = await getUser(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('/users/1');
    expect(result).toEqual(userData);
  });

  it('should handle API errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    await expect(getUser(1)).rejects.toThrow('API Error');
  });
});
```

### 부분 모킹

```js
// config.js
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};

module.exports = config;
```

```js
// service.js
const config = require('./config');

function getApiUrl() {
  return config.apiUrl;
}

module.exports = { getApiUrl };
```

```js
// service.test.js
const { getApiUrl } = require('./service');

// config 모듈의 일부만 모킹
jest.mock('./config', () => ({
  ...jest.requireActual('./config'),
  apiUrl: 'https://test-api.example.com'
}));

describe('Service functions', () => {
  it('should use mocked API URL', () => {
    expect(getApiUrl()).toBe('https://test-api.example.com');
  });
});
```

## 테스트 라이프사이클

Jest는 테스트 실행 전후에 설정이나 정리 작업을 수행할 수 있는 훅을 제공한다.

```js
describe('Test lifecycle', () => {
  let database;

  // 모든 테스트 실행 전에 한 번 실행
  beforeAll(async () => {
    database = await connectToDatabase();
  });

  // 모든 테스트 실행 후에 한 번 실행
  afterAll(async () => {
    await database.close();
  });

  // 각 테스트 실행 전에 실행
  beforeEach(() => {
    initializeTestData();
  });

  // 각 테스트 실행 후에 실행
  afterEach(() => {
    cleanupTestData();
  });

  it('first test', () => {
    // 테스트 로직
  });

  it('second test', () => {
    // 테스트 로직
  });
});
```

## 스냅샷 테스팅

스냅샷 테스팅은 컴포넌트나 함수의 출력을 "스냅샷"으로 저장하고, 이후 실행에서 변경사항을 감지하는 기능이다.

```js
// component.js
function formatUser(user) {
  return {
    id: user.id,
    name: user.name.toUpperCase(),
    email: user.email.toLowerCase(),
    createdAt: new Date(user.createdAt).toISOString()
  };
}

module.exports = { formatUser };
```

```js
// component.test.js
const { formatUser } = require('./component');

describe('formatUser', () => {
  it('should format user data correctly', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'JOHN@EXAMPLE.COM',
      createdAt: '2023-01-01'
    };

    const result = formatUser(user);
    expect(result).toMatchSnapshot();
  });
});
```

## 커버리지 리포트

Jest는 코드 커버리지를 측정하여 테스트가 얼마나 많은 코드를 커버하는지 보여준다.

```bash
# 커버리지 리포트 생성
npm run test:coverage
```

터미널에서 다음과 같은 리포트를 볼 수 있다:

```bash
----------|---------|----------|---------|---------|-------------------
| File       | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files  | 85.71     | 83.33      | 83.33     | 85.71     |
| math.js    | 85.71     | 83.33      | 83.33     | 85.71     | 15,23               |
| ---------- | --------- | ---------- | --------- | --------- | ------------------- |
```

## 실제 프로젝트에서의 활용

### 1. 유틸리티 함수 테스트

```js
// utils/validation.js
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function sanitizeInput(input) {
  return input.trim().toLowerCase();
}

module.exports = { validateEmail, sanitizeInput };
```

```js
// utils/validation.test.js
const { validateEmail, sanitizeInput } = require('./validation');

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim and lowercase input', () => {
      expect(sanitizeInput('  Hello World  ')).toBe('hello world');
      expect(sanitizeInput('USER@EXAMPLE.COM')).toBe('user@example.com');
    });
  });
});
```

### 2. 클래스 테스트

```js
// models/User.js
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.createdAt = new Date();
  }

  getProfile() {
    return {
      name: this.name,
      email: this.email,
      memberSince: this.createdAt.getFullYear()
    };
  }

  updateEmail(newEmail) {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.email = newEmail;
  }
}

module.exports = User;
```

```js
// models/User.test.js
const User = require('./User');

describe('User class', () => {
  let user;

  beforeEach(() => {
    user = new User('John Doe', 'john@example.com');
  });

  describe('constructor', () => {
    it('should create user with correct properties', () => {
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const profile = user.getProfile();
      
      expect(profile).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        memberSince: expect.any(Number)
      });
    });
  });

  describe('updateEmail', () => {
    it('should update email successfully', () => {
      user.updateEmail('newemail@example.com');
      expect(user.email).toBe('newemail@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        user.updateEmail('invalid-email');
      }).toThrow('Invalid email format');
    });
  });
});
```

## 테스트 패턴과 베스트 프랙티스

### 1. AAA 패턴 (Arrange, Act, Assert)

```js
describe('Calculator', () => {
  it('should add two numbers', () => {
    // Arrange: 테스트에 필요한 데이터와 상태 준비
    const calculator = new Calculator();
    const a = 5;
    const b = 3;

    // Act: 테스트하고자 하는 동작 수행
    const result = calculator.add(a, b);

    // Assert: 결과 검증
    expect(result).toBe(8);
  });
});
```

### 2. 테스트 이름 작성 규칙

```js
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when valid ID is provided', () => {
      // 정상 케이스
    });

    it('should throw error when user ID does not exist', () => {
      // 에러 케이스
    });

    it('should throw error when invalid ID format is provided', () => {
      // 입력 검증 케이스
    });
  });
});
```

### 3. 테스트 데이터 관리

```js
// test-utils/fixtures.js
const userFixtures = {
  validUser: {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  },
  adminUser: {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  }
};

module.exports = { userFixtures };
```

```js
// user.test.js
const { userFixtures } = require('./test-utils/fixtures');

describe('User tests', () => {
  it('should process valid user', () => {
    const result = processUser(userFixtures.validUser);
    expect(result.success).toBe(true);
  });
});
```

### 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [Jest GitHub Repository](https://github.com/facebook/jest)
- [Testing JavaScript with Jest - Course](https://testingjavascript.com/) 