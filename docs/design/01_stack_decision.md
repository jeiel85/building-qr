# 01. Stack Decision

## 결론

추천 스택은 다음입니다.

```txt
React + TypeScript + Vite
Three.js WebGL Renderer
qrcode
Capacitor
Vercel
Google Play App Bundle
```

## 왜 Android Native 고정이 아닌가?

Android Native로 만들 수는 있지만, 이 프로젝트는 다음 특성이 있습니다.

- 핵심 가치는 네이티브 API가 아니라 3D 렌더링과 QR 아트 생성이다.
- 웹에서 바로 공유/체험 가능한 장점이 크다.
- Vercel 배포와 SNS 공유 랜딩이 쉽다.
- Capacitor로 Android/iOS 앱 패키징이 가능하다.
- Three.js 생태계를 쓰면 InstancedMesh, 카메라, 조명, 내보내기 구현이 빠르다.

따라서 첫 상용 버전은 웹앱 + 앱 패키징 구조가 가장 현실적입니다.

## WebGPU 대신 WebGL/Three.js 우선인 이유

WebGPU는 장기적으로 매력적이지만, 현재 제품 안정성을 최우선으로 하면 WebGL 기반 Three.js가 더 안전합니다.

- WebGL/Three.js는 브라우저 호환성이 넓다.
- Three.js InstancedMesh로 수백~수천 개 큐브 렌더링이 가능하다.
- 모바일 WebView/브라우저에서 예측 가능성이 WebGPU보다 높다.
- 원본과 비슷한 시각 효과를 구현하기에 충분하다.

## 기술 선택 표

| 영역 | 선택 | 이유 |
|---|---|---|
| UI | React + TypeScript | 빠른 개발, 타입 안정성 |
| Build | Vite | 가볍고 빠른 웹 빌드 |
| 3D | Three.js | WebGL 기반 안정성, 카메라/조명/인스턴싱 지원 |
| 대량 큐브 | InstancedMesh | draw call 감소 |
| QR | qrcode | 브라우저/Node 환경 지원, error correction 옵션 |
| 모바일 앱 | Capacitor | 웹앱을 Android/iOS 앱으로 패키징 |
| 배포 | Vercel | 웹앱 배포 간단 |
| Android | AAB | Play Store 신규 앱 배포 포맷 |
| 테스트 | Vitest + Playwright | 유닛/통합/E2E |
| 상태 | Zustand | 단순하고 예측 가능 |
| 이미지 export | canvas.toBlob + html2canvas 보조 | 공유 이미지 생성 |

## 대안

### 대안 A: Android Native + OpenGL ES

장점:
- Play Store 앱 성능 제어가 좋음
- 네이티브 느낌 좋음

단점:
- iOS/웹 확장 비용 큼
- OpenGL ES 직접 구현 난이도 높음
- 디자인/공유 랜딩 약함

### 대안 B: React Native + WebGPU

장점:
- 원본과 구조가 유사함
- 모바일 앱 감각 좋음

단점:
- WebGPU 네이티브 세팅 리스크
- Expo Go 의존 불가
- Android/iOS 빌드 안정성 검증 부담 큼

### 대안 C: Unity

장점:
- 3D 구현 편함
- 시각 효과 강함

단점:
- QR 생성 유틸 앱으로는 무거움
- 웹/공유/랜딩과 궁합이 낮음
- 앱 용량과 빌드 파이프라인 부담

## 최종 판단

상용 목표 기준으로 가장 균형 잡힌 선택은 다음입니다.

```txt
웹앱으로 제품 완성
→ Vercel 배포
→ Capacitor로 Android 패키징
→ Play Store 배포
→ 필요 시 iOS 확장
```
