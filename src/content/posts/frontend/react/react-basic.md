---
title: "React 기본 개념"
slug: "react-basic"
date: 2025-02-01
tags: ["JavaScript", "React"]
category: "Frontend/React"
draft: true
views: 0
---
리액트(React)는 사용자 인터페이스(UI)를 구축하기 위한 자바스크립트 라이브러리이다.

### 왜 리액트를 사용할까?
리액트의 가장 큰 특징은 페이지를 새로 고침하지 않고도 UI가 부드럽게 갱신된다는 점이다.
순수 바닐라 JS로도 UI를 만들 수 있지만, 복잡한 UI를 개발할 때는 번거롭고 오류가 발생하기 쉽다.
특히, 상태(state)를 관리하면서 DOM을 직접 조작해야 하는 과정은 골치 아픈 일이 될 수 있다.

리액트는 이러한 문제를 해결하기 위해 등장했다. 리액트를 사용하면 선언형(declarative) 프로그래밍 방식으로 UI를 개발할 수 있어 코드가 더 간결하고 유지보수가 쉬워진다.

### 명령형 vs. 선언형 프로그래밍

#### 바닐라 JS - 명령형(Imperative)
명령형 프로그래밍은 어떻게 원하는 결과를 얻을지 세부적인 절차를 직접 명령하는 방식을 의미한다.
DOM을 직접 조작하면서 상태 변화를 관리해야 한다.

*버튼 클릭 시 텍스트 변경하기*
```js
const button = document.createElement('button');
button.textContent = 'Click me';

button.addEventListener('click', () => {
    const text = document.getElementById('text');
    text.textContent = 'Button clicked!';
});

document.body.appendChild(button);
document.body.innerHTML += '<p id="text">Hello</p>';
```

#### 리액트 - 선언형(declarative)
선언형 프로그래밍은 무엇을 원하는지 선언하면, 알아서 처리해주는 방식을 의미한다.
상태(state)를 기반으로 UI를 렌더링하므로, 개발자는 DOM 조작을 직접 할 필요가 없다.

*버튼 클릭 시 텍스트 변경하기*
```jsx
import { useState } from "react";

function App() {
  const [text, setText] = useState("Hello");

  return (
    <div>
      <button onClick={() => setText("Button clicked!")}>Click me</button>
      <p>{text}</p>
    </div>
  );
}

export default App;
```

## 리액트 핵심 개념

### 1. 컴포넌트(Component)
컴포넌트는 UI의 한 부분을 나타내는 재사용 가능한 코드 블록이다.
HTML, CSS, JavaScript 로직을 하나의 파일로 묶어 관리할 수 있어 개발 과정이 단순해진다.

JSX 파일(`.jsx`)은 브라우저에서 직접 지원되지 않지만, 리액트 프로젝트의 빌드 프로세스가 이 코드를 변환하여 브라우저가 이해할 수 있도록 한다.

*index.jsx*
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
```

이 코드는 `App` 컴포넌트를 `root`라는 ID를 가진 DOM 요소에 렌더링한다.
`App` 내부에 중첩된 모든 컴포넌트들도 함께 렌더링된다.

### 2. 렌더링
리액트가 화면에 렌더링하는 과정은 다음과 같다.

1. 컴포넌트 실행

	- 함수형 컴포넌트의 경우 해당 함수가 실행되어 JSX를 반환
	- 클래스형 컴포넌트의 경우 `render()` 메서드가 호출되어 JSX를 반환

2. JSX -> React Element

	- 반환된 JSX는 Babel 등의 트랜스파일러를 통해 `React.createElement()` 호출로 변환됨
	- 이렇게 생성된 React Element는 일반 JavaScript 객체이며, Virtual DOM의 기본 단위가 됨

3. Virtual DOM 생성 및 비교

	- React Element들이 모여 Virtual DOM 트리를 구성함
	- 기존 Virtual DOM과 새 Virtual DOM을 비교하여 변경 사항을 찾음

4. 실제 DOM 업데이트

	- 변경된 부분만 실제 브라우저 DOM에 적용하여 효율적으로 렌더링함

### 3. 컴포넌트 유형
리액트에서는 두 가지 유형의 컴포넌트를 사용할 수 있다.

1. 함수형 컴포넌트 (Functional Components)

    - 간결하고 Hooks와 함께 사용하여 상태 관리가 쉬움
    - `this` 바인딩 문제나 복잡한 구조가 없어서 최근에는 주로 함수형 컴포넌트를 사용함

2. 클래스형 컴포넌트 (Class Components)

    - 이전 리액트 버전에서는 주로 사용되었지만, **this 바인딩 문제**와 복잡한 구조로 인해 현재는 잘 사용하지 않음
    - 코드 재사용이 어려운 점도 단점 중 하나임

### 4. props
Props는 컴포넌트에 데이터를 전달하는 방법이다.
부모 컴포넌트가 자식 컴포넌트에 데이터를 속성 형태로 전달할 수 있다.

```jsx
const CoreConcept = (props) => {
  return (
    <li>
      <img src={props.image} alt={props.title} />
      <h3>{props.title}</h3>
      <p>{props.description}</p>
    </li>
  );
};

export default CoreConcept;

```

*객체 디스트럭처링을 이용한 Props 전달*
```jsx
const CoreConcept = ({image, title, description}) => {
  return (
    <li>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
};

export default CoreConcept;

```

이처럼 디스트럭처링을 사용하면 코드가 더 간결하고 읽기 쉬워진다.

### 5. Children Prop과 이벤트 핸들러
**Children Prop**은 열리고 닫힌 태그 사이에 들어간 값을 전달할 때 사용한다.
또한 `onClick`과 같은 내장된 이벤트 핸들러를 통해 특정 이벤트가 발생했을 때 트리거되는 함수를 정의할 수 있다.

*이벤트 함수에 인자 전달하기*
```jsx
import Header from "./components/Header";
import CoreConcept from "./components/CoreConcept";
import { CORE_CONCEPT } from "./data";
import TabButton from "./components/TabButton";

function App() {
  const handleSelect = (selectedButton) => {
    console.log(selectedButton);
  };

  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concept</h2>
          <ul>
            <CoreConcept {...CORE_CONCEPT[0]} />
            <CoreConcept {...CORE_CONCEPT[1]} />
            <CoreConcept {...CORE_CONCEPT[2]} />
            <CoreConcept {...CORE_CONCEPT[3]} />
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton label="Components" onSelect={() => handleSelect("component")} />
            <TabButton label="JSX" onSelect={() => handleSelect("jsx")} />
            <TabButton label="Props" onSelect={() => handleSelect("props")} />
            <TabButton label="State" onSelect={() => handleSelect("state")} />
          </menu>
        </section>
      </main>
    </div>
  );
}

export default App;
```

### 6. 상태 관리
단순한 변수 업데이트로는 UI가 갱신되지 않는다.
리액트에서는 useState를 사용하여 상태를 관리하고, 상태가 변경될 때마다 컴포넌트를 자동으로 리렌더링한다.

*useState를 이용한 상태 관리*
```jsx
import { useState } from "react";

function App() {
  const [content, setContent] = useState("Please click a button.");

  const handleSelect = (selectedButton) => {
    setContent(selectedButton);
    console.log(selectedButton);
  };

  return (
    <div>
      <Header />
      <main>
        <section id="core-concepts">
          <h2>Core Concept</h2>
          <ul>
            <CoreConcept {...CORE_CONCEPT[0]} />
            <CoreConcept {...CORE_CONCEPT[1]} />
            <CoreConcept {...CORE_CONCEPT[2]} />
            <CoreConcept {...CORE_CONCEPT[3]} />
          </ul>
        </section>
        <section id="examples">
          <h2>Examples</h2>
          <menu>
            <TabButton label="Components" onSelect={() => handleSelect("component")} />
            <TabButton label="JSX" onSelect={() => handleSelect("jsx")} />
            <TabButton label="Props" onSelect={() => handleSelect("props")} />
            <TabButton label="State" onSelect={() => handleSelect("state")} />
          </menu>
          <section>{content}</section>
        </section>
      </main>
    </div>
  );
}

export default App;
```

### 7. JSX, Fragment
JSX는 JavaScript 안에 HTML을 작성할 수 있게 해주는 문법이다.
JSX를 사용할 때는 반드시 하나의 상위 태그로 감싸야 한다.

```jsx
import React from "react";

function App() {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
}

export default App;
```

Fragment(`<>...</>`)를 사용하면 불필요한 DOM 요소 없이 여러 요소를 감싸서 반환할 수 있다.

### 8. 함수형 업데이트와 비동기 처리
리액트의 상태 업데이트는 비동기적으로 처리된다.
이전 상태 값을 기반으로 업데이트할 때는 함수형 업데이트를 사용할 수 있다.

*함수형 업데이트*
```jsx
function handleClick() {
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1);
}
```

이 경우 `count`는 3만큼 증가한다. 반면, 단순한 변수 참조로 상태를 업데이트하면 의도한 결과를 얻지 못할 수 있다.

*잘못된 예*
```jsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

이 경우 `count`는 1만 증가한다.

### 9. 양방향 바인딩
리액트에서는 입력 필드와 상태를 연결하여 양방향 바인딩을 구현할 수 있다.

*양방향 바인딩*
```jsx
import React, { useState } from 'react';

function TwoWayBindingExample() {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <h2>양방향 바인딩 예제</h2>
      <input 
        type="text" 
        value={text} 
        onChange={handleChange} 
        placeholder="텍스트를 입력하세요" 
      />
      <p>입력한 값: {text}</p>
    </div>
  );
}

export default TwoWayBindingExample;
```

- **UI -> 상태**: `onChange` 이벤트가 발생할 때 입력 값을 `setText`로 업데이트한다.
- **상태 -> UI**: `input` 요소의 `value`에 상태 `text`를 바인딩하여 상태가 변경될 때마다 입력 필드의 값도 자동으로 갱신된다.