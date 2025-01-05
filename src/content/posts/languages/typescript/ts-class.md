---
title: "[TS] 클래스(Class)"
slug: "ts-class"
date: 2024-11-17
tags: ["TypeScript", "Class"]
category: "Languages/TypeScript"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png"
draft: false
---
![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/bdb3fceafe9378092615c3f6ddf659a2.png)

TypeScript의 클래스는 JavaScript의 클래스 문법을 기반으로 하되, 타입 시스템과 접근 제어자 등 객체 지향 프로그래밍의 핵심 기능들을 추가로 제공한다.

## 생성자와 프로퍼티 초기화
TypeScript의 클래스에서는 접근 제한자를 사용한 간결한 생성자 문법을 제공한다.
```ts
// 기존 JavaScript 방식
class Person {
  age: number;

  constructor(age: number) {
    this.age = age;
  }
}

// TypeScript의 간결한 방식
class Person {
  constructor(public age: number) {} // public 접근 제한자
}
```
생성자의 매개변수에 접근 제한자를 붙이면
1. 해당 매개변수가 클래스의 프로퍼티로 자동 선언됨
2. 생성자 내부의 할당 코드가 자동 생성됨

## 게터(Getter)와 세터(Setter)
클래스 프로퍼티에 대한 접근과 수정을 제어하기 위해 게터와 세터를 사용할 수 있다.
```ts
class Person {
  constructor(private _name: string) {}

  // getter
  get name(): string {
    return this._name;
  }

  // setter
  set name(newName: string) {
    if (newName.length > 0) {
      this._name = newName;
    }
  }
}

const person = new Person("Kim");
console.log(person.name);  // getter 호출
person.name = "Lee";       // setter 호출
```
> 💡 관례적으로 private 프로퍼티 이름 앞에 언더스코어(\_)를 붙인다.

## 접근 제한자
TypeScript는 세 가지 접근 제한자를 제공한다.
#### 1. private
- 해당 클래스 내부에서만 접근 가능
- 자식 클래스에서도 접근 불가
```ts
class Example {
  private secret: string;
  
  constructor(secret: string) {
    this.secret = secret;
  }
}

const ex = new Example("비밀");
console.log(ex.secret); // 컴파일 에러
```

#### 2. protected
- 해당 클래스와 상속받은 자식 클래스에서 접근 가능
- 외부에서는 접근 불가
```ts
class Parent {
  protected data: string = "protected data";
}

class Child extends Parent {
  showData() {
    console.log(this.data); // 접근 가능
  }
}

const parent = new Parent();
console.log(parent.data); // 컴파일 에러
```

#### 3. public
- 어디서든 접근 가능
- 접근 제한자를 명시하지 않으면 기본값은 public

## readonly와 불변성
`readonly` 키워드를 사용하면 프로퍼티를 읽기 전용으로 만들 수 있다.
```ts
class Configuration {
  constructor(
    public readonly apiKey: string,
    public readonly maxRetries: number = 3
  ) {}
}

const config = new Configuration("my-api-key");
config.apiKey = "new-key"; // 컴파일 에러
```

## 추상 클래스와 메서드
추상 클래스는 다른 클래스가 상속받을 수 있는 기본 클래스를 정의할 때 사용한다.
```ts
abstract class Animal {
  constructor(protected name: string) {}
  
  // 추상 메서드는 반드시 자식 클래스에서 구현해야 함
  abstract makeSound(): void;
  
  // 일반 메서드도 포함 가능
  move(): void {
    console.log(`${this.name} is moving.`);
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log("Woof!");
  }
}

// const animal = new Animal("Pet"); // 에러: 추상 클래스의 인스턴스 생성 불가
const dog = new Dog("Bobby");
dog.makeSound(); // "Woof!"
```

## 정적 멤버
`static` 키워드를 사용하여 클래스의 정적 멤버를 정의할 수 있다.
```ts
class MathHelper {
  static readonly PI = 3.14159;
  
  static square(x: number): number {
    return x * x;
  }
}

console.log(MathHelper.PI);     // 3.14159
console.log(MathHelper.square(4)); // 16
```

**static 멤버의 주요 특징:**
1. 클래스가 로드될 때 메모리에 한 번만 생성됨
2. 모든 인스턴스가 같은 static 멤버를 공유함
3. 클래스 이름으로 직접 접근이 가능함
4. 인스턴스 없이도 사용할 수 있음

## 클래스 상속
클래스 상속을 통해 기존 클래스의 기능을 확장할 수 있다.
### 기본 상속
```ts
class Animal {
  constructor(protected name: string) {}
  
  move(): void {
    console.log(`${this.name} is moving.`);
  }
}

class Dog extends Animal {
  constructor(name: string, private breed: string) {
    super(name); // 부모 클래스의 생성자 호출
  }

  bark(): void {
    console.log("Woof!");
  }
}

const dog = new Dog("Buddy", "Poodle");
dog.move(); // "Buddy is moving."
dog.bark(); // "Woof!"
```

### 메서드 오버라이딩
자식 클래스에서 부모 클래스의 메서드를 재정의할 수 있다.
```ts
class Cat extends Animal {
  move(): void {
    console.log("Sneaking quietly..."); // 부모 클래스의 move() 메서드를 오버라이드
    super.move(); // 부모 클래스의 메서드도 호출 가능
  }
}

const cat = new Cat("Navi");
cat.move();
// 출력:
// Sneaking quietly...
// Navi is moving.
```

### 인터페이스 구현
클래스는 하나 이상의 인터페이스를 구현할 수 있다.
```ts
interface Movable {
  move(): void;
}

interface Soundable {
  makeSound(): void;
}

class Horse implements Movable, Soundable {
  move(): void {
    console.log('다그닥다그닥');
  }

  makeSound(): void {
    console.log('히히힝!');
  }
}
```

## 주의 사항
### 런타임에서의 접근 제한자
TypeScript의 접근 제한자(private, protected 등)는 컴파일 시점에만 동작한다. JavaScript로 컴파일되면 일반 프로퍼티로 변환되어 런타임에서는 접근이 가능해진다.
```ts
class User {
  constructor(private name: string) {}
}

const user = new User("Kim");
console.log(user.name); // Property 'name' is private and only accessible within class 'User'.ts(2341)
console.log((user as any).name); // 타입 캐스팅으로 접근 가능
console.log(user["name"]); // 인덱스로 접근 가능
```
이는 TypeScript가 JavaScript로 컴파일될 때 다음과 같이 변환되기 때문이다:
```js
var User = /** @class */ (function () {
    function User(name) {
        this.name = name;
    }
    
    return User;
}());

var user = new User("Kim");
console.log(user.name); // 타입 캐스팅으로 접근 가능
console.log(user["name"]); // 인덱스로 접근 가능
```

### 실제 데이터 보호가 필요한 경우
민감한 데이터나 실제 보안이 필요한 정보는 서버 사이드에서 관리하는 것이 좋다. 클라이언트 사이드의 접근 제한자는 개발 단계에서의 실수를 방지하는 용도로 사용하자.