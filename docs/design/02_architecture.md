# 02. Architecture

## 전체 아키텍처

```txt
User Input
  ↓
Input Validation
  ↓
QR Matrix Engine
  ↓
QR Reliability Layer
  ↓
Art Mapping Engine
  ↓
3D Scene Data
  ↓
Three.js Renderer
  ↓
View Modes
  ├─ 3D Art Mode
  └─ 2D Scan Mode
  ↓
Export / Share / Save
```

## 폴더 구조

```txt
src/
├─ app/
│  ├─ App.tsx
│  ├─ routes.tsx
│  └─ providers.tsx
├─ features/
│  └─ blossom-qr/
│     ├─ components/
│     │  ├─ BlossomQrScreen.tsx
│     │  ├─ QrInputPanel.tsx
│     │  ├─ RenderViewport.tsx
│     │  ├─ PresetSelector.tsx
│     │  ├─ ExportPanel.tsx
│     │  └─ ScanReliabilityPanel.tsx
│     ├─ qr/
│     │  ├─ generateQrMatrix.ts
│     │  ├─ validateQrInput.ts
│     │  ├─ qrTypes.ts
│     │  └─ qrScanHeuristics.ts
│     ├─ art/
│     │  ├─ blockTypes.ts
│     │  ├─ generateBlocks.ts
│     │  ├─ presets.ts
│     │  ├─ palette.ts
│     │  └─ seededRandom.ts
│     ├─ render/
│     │  ├─ BlossomRenderer.ts
│     │  ├─ createScene.ts
│     │  ├─ createInstancedBlocks.ts
│     │  ├─ cameraController.ts
│     │  ├─ lighting.ts
│     │  ├─ materials.ts
│     │  └─ captureCanvas.ts
│     ├─ store/
│     │  └─ blossomQrStore.ts
│     └─ index.ts
├─ shared/
│  ├─ components/
│  ├─ utils/
│  ├─ constants/
│  └─ types/
├─ platform/
│  ├─ capacitor/
│  ├─ web/
│  └─ share/
└─ tests/
   ├─ unit/
   ├─ e2e/
   └─ fixtures/
```

## 주요 모듈 책임

### QR Matrix Engine

- 입력 문자열을 QR matrix로 변환
- Error correction level 설정
- QR version / matrix size 제한
- quiet zone 관리
- matrix metadata 반환

### QR Reliability Layer

- 실제 스캔 가능성을 위한 제약 관리
- 2D 모드 대비 기준 검증
- 긴 텍스트 경고
- 3D 모드에서 스캔을 강요하지 않고 2D 모드로 유도
- export 이미지에 scan-safe mode 제공

### Art Mapping Engine

- QR matrix를 블록 데이터로 변환
- 벚꽃, 줄기, 흙, 잔디, 꽃잎 타입 결정
- deterministic seeded random 사용
- 같은 입력이면 같은 아트 결과 생성
- 과도한 랜덤으로 QR 구조를 훼손하지 않음

### Three.js Renderer

- Scene / Camera / Renderer lifecycle 관리
- InstancedMesh 기반 큐브 렌더링
- resize 대응
- devicePixelRatio 제한
- dispose 처리
- 저사양 fallback

### Export Layer

- PNG 내보내기
- 투명/배경 포함 옵션
- 해상도 선택
- Web Share API 지원
- 모바일 갤러리 저장은 Capacitor 플러그인으로 후속 처리

## 상태 모델

```ts
type ViewMode = "art3d" | "scan2d";

type QrState = {
  input: string;
  matrix: boolean[][];
  matrixSize: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  isTooLong: boolean;
  scanReliability: "good" | "warning" | "bad";
};

type ArtState = {
  presetId: string;
  paletteId: string;
  blockCount: number;
  seed: string;
};

type RenderState = {
  viewMode: ViewMode;
  cameraProgress: number;
  isRendering: boolean;
  fpsEstimate?: number;
};

type ExportState = {
  format: "png" | "webp";
  resolution: 1024 | 2048 | 4096;
  includeBackground: boolean;
};
```

## 데이터 흐름 원칙

- QR matrix는 순수 함수로 생성합니다.
- block data도 순수 함수로 생성합니다.
- renderer는 입력 데이터를 받아 그리기만 합니다.
- UI state와 렌더링 lifecycle을 분리합니다.
- 모든 export는 scan-safe 모드 옵션을 제공합니다.
