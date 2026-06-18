# 03. Rendering Design

## 목표

3D 벚꽃 QR 아트를 부드럽게 렌더링하면서도 모바일 브라우저와 WebView에서 안정적으로 동작하게 합니다.

## 렌더링 방식

### 기본

- Three.js WebGLRenderer
- PerspectiveCamera for 3D mode
- OrthographicCamera or top-down perspective for scan mode
- InstancedMesh for block rendering
- AmbientLight + DirectionalLight
- Optional fake shadow plane

### 왜 InstancedMesh인가?

QR matrix가 33x33만 되어도 기본 바닥 블록은 1,089개입니다. 벚꽃 캐노피 레이어를 쌓으면 블록 수가 수천 개까지 늘어날 수 있습니다. 각 큐브를 개별 Mesh로 만들면 draw call이 많아져 모바일에서 부담이 큽니다.

InstancedMesh를 사용하면 같은 geometry/material을 공유하면서 위치/색상/스케일만 다르게 렌더링할 수 있습니다.

## 블록 타입

```ts
type BlockType =
  | "dirt"
  | "trunk"
  | "cherryBlossom"
  | "grass"
  | "fallenPetal"
  | "finderMarker";
```

## Material 전략

초기에는 타입별 material을 분리합니다.

```txt
DirtMaterial
TrunkMaterial
BlossomMaterial
GrassMaterial
PetalMaterial
FinderMarkerMaterial
```

성능 최적화 단계에서는 하나의 InstancedMesh + instanceColor 방식으로 통합할 수 있습니다.

## QR 스캔 모드

스캔 모드는 아트 모드와 다르게 처리합니다.

### 3D Art Mode

- 예쁨 우선
- 등각 카메라
- 조명/그림자 사용
- 블록 높이 차이 있음
- 벚꽃 캐노피 표현

### 2D Scan Mode

- 스캔 가능성 우선
- 탑다운 카메라
- 원근 왜곡 최소화
- high contrast material 사용
- finder pattern 선명화
- quiet zone 확보
- 장식 요소 최소화

## 카메라 전환

```txt
progress = 0 → 3D Art Mode
progress = 1 → 2D Scan Mode
```

보간 대상:

- camera position
- camera rotation
- camera type or projection parameters
- light intensity
- block height scale
- blossom decoration visibility
- background intensity

## 성능 목표

| 항목 | 목표 |
|---|---|
| 일반 모바일 | 30fps 이상 |
| 데스크톱 | 60fps |
| 최대 matrix size | 기본 41x41 |
| 최대 block count | 8,000 이하 권장 |
| DPR 제한 | 모바일 1.5~2.0 |
| 메모리 누수 | scene dispose 필수 |

## Fallback

WebGL 사용 불가 또는 성능 부족 시:

1. 2D Canvas QR Art
2. static PNG preview
3. 기본 QR image

## Renderer Lifecycle

```txt
mount
→ create renderer
→ create scene
→ generate mesh
→ start animation loop
→ update on state change
→ resize on viewport change
→ capture on export
→ dispose on unmount
```

## Export Rendering

고해상도 export는 화면 렌더러와 별도 offscreen renderer를 사용하는 것이 안전합니다.

```txt
current scene data
→ create export renderer
→ set target resolution
→ render scan-safe or art-safe mode
→ canvas.toBlob
→ cleanup
```
