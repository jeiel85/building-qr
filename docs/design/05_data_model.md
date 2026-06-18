# 05. Data Model

## QR Matrix

```ts
type QrMatrix = {
  modules: boolean[][];
  size: number;
  version?: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  input: string;
};
```

## Block Data

```ts
type BlockData = {
  id: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  type: BlockType;
  colorVariant: number;
  qrModuleX?: number;
  qrModuleY?: number;
  isQrCritical: boolean;
};
```

## Art Preset

```ts
type ArtPreset = {
  id: string;
  name: string;
  description: string;
  palette: Palette;
  canopyRadiusFactor: number;
  maxCanopyLayers: number;
  trunkLayerCount: number;
  petalDensity: number;
  grassDensity: number;
  scanSafeDecorations: boolean;
};
```

## Palette

```ts
type Palette = {
  background: string;
  dirt: string[];
  trunk: string[];
  blossom: string[];
  grass: string[];
  petal: string[];
  finder: string;
  scanDark: string;
  scanLight: string;
};
```

## Export Metadata

```ts
type ExportMetadata = {
  inputHash: string;
  createdAt: string;
  presetId: string;
  matrixSize: number;
  errorCorrectionLevel: string;
  mode: "art3d" | "scan2d";
  resolution: number;
};
```

## Deterministic Random

같은 입력과 같은 프리셋이면 같은 결과가 나오도록 seed 기반 random을 사용합니다.

```txt
seed = hash(input + presetId + paletteId)
```

이렇게 하면 사용자가 같은 링크를 다시 입력했을 때 동일한 아트가 생성됩니다.
