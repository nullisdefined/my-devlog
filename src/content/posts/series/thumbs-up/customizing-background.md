---
title: "배경 커스터마이징 기능 구현하기"
slug: "customizing-background"
date: 2024-10-30
tags: ["React", "TypeScript", "TailwindCSS", "ToyProject"]
category: "Series/thumbs-up"
thumbnail: "https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c80c482a1207d43b83b93c6cb8a2558b.png"
draft: false
views: 0
---
배경에서는 그라디언트, 단색, 이미지로 커스터마이징할 수 있게 구현했다. 특히 색상 선택의 어려움을 해결하기 위해 셔플 버튼으로 미리 준비된 색상 조합을 제공하는 기능을 추가했다.
## 주요 기능
1. 그라디언트 배경: 두 가지 색상 조합으로 그라디언트를 설정한다.
2. 단색 배경: 단순한 색상으로 배경을 채운다.
3. 이미지 배경: 사용자가 이미지를 업로드하고 크롭하거나 블러 효과를 조절할 수 있다.
4. 셔플 버튼: 미리 정의된 색상 조합에서 랜덤으로 선택해준다.

## 1. 배경 타입 선택
그라디언트, 단색, 이미지 중 하나를 선택할 수 있도록 버튼을 구성했다.
```tsx
<Button
  variant={bgType === "gradient" ? "default" : "outline"}
  onClick={() => setBgType("gradient")}
  className="flex-1"
>
  <Palette className="w-4 h-4 mr-2" />
  Gradient
</Button>
<Button
  variant={bgType === "solid" ? "default" : "outline"}
  onClick={() => setBgType("solid")}
  className="flex-1"
>
  <Palette className="w-4 h-4 mr-2" />
  Solid
</Button>
<Button
  variant={bgType === "image" ? "default" : "outline"}
  onClick={() => setBgType("image")}
  className="flex-1"
>
  <ImageIcon className="w-4 h-4 mr-2" />
  Image
</Button>
```
- `bgType` 상태를 기준으로 선택된 배경 타입의 버튼 스타일을 변경했다.
- 클릭 시 `setBgType`을 호출해 배경 타입을 변경한다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/c80c482a1207d43b83b93c6cb8a2558b.png)

## 2. 그라디언트 배경
두 가지 색상을 선택해 그라디언트를 만들 수 있다.
```tsx
{bgType === "gradient" && (
  <div className="flex space-x-2">
    <Input
      type="color"
      value={bgColor1}
      onChange={(e) => setBgColor1(e.target.value)}
    />
    <Input
      type="color"
      value={bgColor2}
      onChange={(e) => setBgColor2(e.target.value)}
    />
  </div>
)}
```

색상 선택이 어렵고 귀찮다는 점을 고려해 셔플 버튼을 추가했다. `gradientPresets`라는 리스트에 추천 색상 조합을 미리 정의하고, 랜덤으로 선택하는 방식을 사용했다.

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/3fbf298d374a49336b7e48e13cbb3fc8.png)
*gradientPresets 색상 조합 리스트*

```tsx
const gradientPresets = [
  { from: "#FF6B6B", to: "#4ECDC4" },
  { from: "#3494E6", to: "#EC6EAD" },
  { from: "#FC466B", to: "#3F5EFB" },
  // ...
];

const handleRandomGradient = () => {
  const randomIndex = Math.floor(Math.random() * gradientPresets.length);
  const preset = gradientPresets[randomIndex];
  setBgColor1(preset.from);
  setBgColor2(preset.to);
};
```

```tsx
<Button
  onClick={handleRandomGradient}
  variant="outline"
  className="w-full mt-4"
>
  <Shuffle className="w-4 h-4 mr-2" />
  Shuffle
</Button>

```

## 3. 단색 배경
단색 배경은 하나의 색상만 선택할 수 있다.

```tsx
{bgType === "solid" && (
  <Input
    type="color"
    value={bgColor1}
    onChange={(e) => setBgColor1(e.target.value)}
  />
)}
```

## 4. 이미지 배경
이미지를 업로드하고 배경으로 사용할 수 있도록 했다. 또한 추가로 이미지 크롭과 블러 효과를 조절할 수 있게 했다.
### 파일 업로드 처리
```tsx
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target?.result as string;
      image.onload = () => setBgImage(image);
    };
    reader.readAsDataURL(file);
  }
};
```

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/118fe0e830fcd3831c7c9b53d0c3192d.png)
*이미지 크롭과 블러 효과 조절 인터페이스*

![image](https://nullisdefined.s3.ap-northeast-2.amazonaws.com/images/1bdc4fc2639b29b22c87f688e9ca3f0d.png)
*적용 후 캔버스*

### 이미지 크롭 및 블러
`react-image-crop` 라이브러리를 사용해 이미지 크롭 기능을 구현했다.

```tsx
<ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
  <img src={bgImage.src} onLoad={(e) => onImageLoad(e.currentTarget)} />
</ReactCrop>
```

이미지 블러는 Canvas API의 `ctx.filter`를 사용해 처리했다.

```tsx
if (imageBlur > 0) {
  ctx.filter = `blur(${imageBlur}px)`;
}
ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
```

## 5. 캔버스에 배경 그리기
선택된 배경 타입에 따라 캔버스에 그리는 방식이 달라진다.

```tsx
if (bgType === "gradient") {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, bgColor1);
  gradient.addColorStop(1, bgColor2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
} else if (bgType === "solid") {
  ctx.fillStyle = bgColor1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
} else if (bgType === "image" && bgImage) {
  if (imageBlur > 0) {
    ctx.filter = `blur(${imageBlur}px)`;
  }
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  ctx.filter = "none";
}
```

---
이 프로젝트의 모든 소스 코드는 [GitHub](https://github.com/nullisdefined/thumbs-up)에 공개되어 있습니다. 코드 품질 개선이나 새로운 기능 제안에 대한 피드백은 언제나 환영합니다.