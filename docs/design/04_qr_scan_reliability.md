# 04. QR Scan Reliability

## 핵심 원칙

이 제품의 본질은 QR입니다. 예뻐도 스캔되지 않으면 실패입니다.

## QR 품질 정책

### 입력 제한

- 기본 권장: 80자 이하
- 경고: 120자 이상
- 차단 또는 강한 경고: matrix size가 41을 초과하는 경우
- URL은 가능하면 단축 URL 사용 안내

### Error Correction

초기 기본값:

```txt
M 또는 Q
```

- M: 용량과 스캔 안정성 균형
- Q: 장식이 많은 경우 안정성 증가
- H: 가장 강하지만 matrix가 커져 3D 블록 수 증가

사용자에게 고급 옵션으로 제공할 수 있습니다.

## 스캔 가능 모드

### 3D Art Mode

- 시각적 감상용
- 스캔 가능할 수도 있지만 보장하지 않음

### 2D Scan Mode

- 스캔 보장 목표
- QR 모듈 정렬 유지
- finder pattern 강조
- quiet zone 유지
- 장식 요소 제거 또는 투명도 감소

## Quiet Zone

QR 외곽에 최소 4 module 이상의 여백을 둡니다.

```txt
matrix size N
rendered grid size = N + quietZone * 2
```

## Finder Pattern 보호

QR의 세 모서리 finder pattern은 장식 규칙보다 우선합니다.

- finder pattern 영역은 구조 변형 금지
- 색상 대비 강화
- 높이 변화 최소화
- top-down mode에서 정사각형 구조 유지

## 스캔 신뢰성 점수

```ts
type ScanReliability = {
  level: "good" | "warning" | "bad";
  reasons: string[];
  matrixSize: number;
  blockCount: number;
  estimatedContrast: number;
};
```

## 사용자 안내 문구

### Good

> 이 QR은 스캔용 보기에서 안정적으로 인식될 가능성이 높습니다.

### Warning

> 입력이 길거나 장식이 많아 일부 카메라에서 인식이 느릴 수 있습니다. 스캔용 보기 또는 짧은 링크 사용을 권장합니다.

### Bad

> 현재 입력은 QR 구조가 너무 복잡합니다. 짧은 URL로 변경해야 안정적으로 스캔됩니다.

## QA 방법

수동 테스트:

- iPhone 기본 카메라
- Android 기본 카메라
- Samsung Camera
- Google Lens
- 카카오톡 QR 스캐너 가능 시
- 저조도 캡처
- 화면 밝기 50%
- 이미지 공유 후 다른 폰에서 스캔

자동 테스트:

- matrix 생성 스냅샷
- finder pattern 영역 검증
- quiet zone 검증
- 이미지 export 후 ZXing 또는 jsQR 기반 디코딩 테스트
