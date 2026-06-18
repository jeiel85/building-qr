# 06. Goal Prompts

아래 goal들은 바이브 코딩 도구에 순차적으로 던지는 것을 전제로 작성했습니다.

---

# Goal 1 — Production Project Foundation

```txt
/goal
상용 배포 가능한 Cherry Blossom QR Art 웹앱 프로젝트의 기반을 만들어줘.

기술 스택:
- React
- TypeScript
- Vite
- Three.js
- qrcode
- Zustand
- Vitest
- Playwright
- ESLint
- Prettier

요구사항:
1. 프로젝트 구조를 다음 기준으로 구성한다.
   - src/app
   - src/features/blossom-qr
   - src/shared
   - src/platform
   - src/tests
2. 라우팅은 단일 페이지로 시작하되, 향후 pricing/about/privacy 페이지 추가가 가능하게 만든다.
3. TypeScript strict 모드를 활성화한다.
4. ESLint/Prettier를 적용한다.
5. 기본 CI용 npm scripts를 만든다.
   - dev
   - build
   - preview
   - test
   - test:e2e
   - lint
   - typecheck
6. 기본 UI는 모바일 퍼스트로 구성한다.
7. README에 실행 방법과 폴더 구조를 작성한다.

완료 기준:
- npm install 후 npm run dev 실행 가능
- npm run build 성공
- npm run typecheck 성공
- 빈 화면이 아니라 기본 앱 레이아웃이 표시됨
```

---

# Goal 2 — QR Matrix Engine & Validation

```txt
/goal
Cherry Blossom QR Art 앱의 QR matrix engine을 구현해줘.

요구사항:
1. qrcode 패키지를 사용해 입력 문자열을 QR matrix boolean[][]로 변환한다.
2. errorCorrectionLevel은 기본 M으로 설정하고 L/M/Q/H 옵션을 타입으로 정의한다.
3. QR matrix size, input length, block count 예상치를 계산한다.
4. 너무 긴 입력에 대해 warning/bad 상태를 반환한다.
5. quiet zone 개념을 데이터 모델에 포함한다.
6. finder pattern 영역을 식별하는 유틸 함수를 만든다.
7. QR 생성 실패 시 사용자 친화적인 에러를 반환한다.

파일 예시:
- src/features/blossom-qr/qr/generateQrMatrix.ts
- src/features/blossom-qr/qr/validateQrInput.ts
- src/features/blossom-qr/qr/qrTypes.ts
- src/features/blossom-qr/qr/qrScanHeuristics.ts

테스트:
- 짧은 URL matrix 생성 테스트
- 긴 문자열 warning 테스트
- 빈 문자열 validation 테스트
- finder pattern 영역 식별 테스트
- quiet zone 계산 테스트

완료 기준:
- QR matrix 생성 로직이 UI와 분리된 순수 함수로 동작
- unit test 통과
```

---

# Goal 3 — 2D Scan-Safe Preview

```txt
/goal
QR matrix를 기반으로 스캔 가능한 2D preview 화면을 구현해줘.

목표:
- 3D 구현 전에 실제 QR 스캔 신뢰성을 검증할 수 있는 2D 모드를 만든다.

요구사항:
1. Canvas 또는 SVG 기반으로 QR matrix를 렌더링한다.
2. quiet zone을 포함한다.
3. dark/light contrast가 충분하도록 기본 색상을 설정한다.
4. finder pattern 영역은 선명하게 유지한다.
5. 입력 변경 시 즉시 preview가 갱신된다.
6. scan reliability panel을 표시한다.
7. PNG export의 기초 구조를 만든다.

UI:
- 상단: QR preview
- 중단: 입력 TextField
- 하단: scan reliability status
- 버튼: PNG 저장, 샘플 URL 적용

테스트:
- matrix size에 맞는 module count 렌더링
- quiet zone 렌더링
- export blob 생성

완료 기준:
- 스마트폰 카메라로 preview QR을 스캔할 수 있음
- QR이 긴 경우 사용자에게 명확한 경고 표시
```

---

# Goal 4 — 3D Block Data Generator

```txt
/goal
QR matrix를 3D Cherry Blossom block data로 변환하는 art mapping engine을 구현해줘.

요구사항:
1. BlockType을 정의한다.
   - dirt
   - trunk
   - cherryBlossom
   - grass
   - fallenPetal
   - finderMarker
2. QR matrix의 dark/light module을 기반으로 block data를 생성한다.
3. light module은 dirt 계열로 표현한다.
4. dark module은 위치에 따라 trunk, cherryBlossom, grass로 분기한다.
5. 중앙 영역에는 trunk를 여러 층 쌓는다.
6. 캐노피 영역에는 cherryBlossom block을 여러 층 쌓는다.
7. finder pattern 영역은 scan-safe 처리를 위해 식별 가능하게 표시한다.
8. deterministic seeded random을 사용한다.
9. block count 상한을 둔다.
10. 같은 input/preset이면 같은 block data가 생성되어야 한다.

파일:
- src/features/blossom-qr/art/blockTypes.ts
- src/features/blossom-qr/art/generateBlocks.ts
- src/features/blossom-qr/art/seededRandom.ts
- src/features/blossom-qr/art/presets.ts
- src/features/blossom-qr/art/palette.ts

테스트:
- 같은 seed 결과 동일성
- block count 상한
- finder pattern 보존
- matrix 크기별 block data 생성

완료 기준:
- QR matrix 입력 시 Three.js 렌더러에 넘길 수 있는 BlockData[] 생성
```

---

# Goal 5 — Three.js 3D Renderer

```txt
/goal
Three.js 기반 3D renderer를 구현해줘.

요구사항:
1. WebGLRenderer를 사용한다.
2. Scene, Camera, Light, Renderer lifecycle을 분리한다.
3. InstancedMesh로 block data를 렌더링한다.
4. block type별 색상과 높이를 적용한다.
5. 모바일 성능을 위해 devicePixelRatio를 제한한다.
6. resize 대응을 구현한다.
7. unmount 시 geometry/material/renderer dispose를 수행한다.
8. WebGL 미지원 시 2D preview fallback으로 전환한다.
9. 기본 orbit interaction은 제한하고, 제품 UX에 맞게 자동 카메라만 제공한다.

파일:
- src/features/blossom-qr/render/BlossomRenderer.ts
- src/features/blossom-qr/render/createScene.ts
- src/features/blossom-qr/render/createInstancedBlocks.ts
- src/features/blossom-qr/render/cameraController.ts
- src/features/blossom-qr/render/lighting.ts
- src/features/blossom-qr/render/materials.ts

완료 기준:
- QR block data가 3D 벚꽃 블록 구조로 렌더링됨
- 모바일 브라우저에서 조작 없이 표시됨
- scene dispose 누락 없음
```

---

# Goal 6 — 3D Art Mode ↔ 2D Scan Mode Transition

```txt
/goal
3D 감상 모드와 2D 스캔 모드 사이의 전환을 구현해줘.

요구사항:
1. viewMode는 art3d / scan2d로 정의한다.
2. 탭 또는 버튼으로 모드를 전환한다.
3. camera position, rotation, projection, light intensity를 progress 기반으로 보간한다.
4. scan2d 모드에서는 top-down view로 전환한다.
5. scan2d 모드에서는 장식 블록 높이와 색상 대비를 스캔 친화적으로 조정한다.
6. finder pattern을 더 선명하게 만든다.
7. 전환 애니메이션은 400~700ms 정도로 부드럽게 만든다.
8. prefers-reduced-motion 사용자는 즉시 전환한다.

완료 기준:
- 3D에서는 예쁜 아트로 보임
- 2D에서는 실제 QR 스캔이 가능함
- 모바일에서 전환이 끊기지 않음
```

---

# Goal 7 — Export, Share, Save

```txt
/goal
상용 배포 수준의 export/share/save 기능을 구현해줘.

요구사항:
1. PNG export를 구현한다.
2. art3d export와 scan2d export를 분리한다.
3. export 해상도 옵션을 제공한다.
   - 1024
   - 2048
   - 4096 가능 시
4. 배경 포함/투명 배경 옵션을 제공한다.
5. Web Share API를 지원한다.
6. Web Share API가 불가능하면 download fallback을 제공한다.
7. 모바일 WebView/Capacitor 환경에서 공유 가능한 구조를 만든다.
8. export 중 loading 상태와 실패 에러를 표시한다.
9. export 이미지가 너무 큰 경우 안내한다.

완료 기준:
- 데스크톱 브라우저에서 PNG 다운로드 가능
- 모바일 브라우저에서 공유 가능
- scan2d export는 다른 기기에서 스캔 가능
```

---

# Goal 8 — Product UI/UX Polish

```txt
/goal
Cherry Blossom QR Art 앱을 상용 배포 가능한 UI/UX 수준으로 다듬어줘.

요구사항:
1. 모바일 퍼스트 레이아웃을 완성한다.
2. 데스크톱에서는 preview와 control panel을 2-column으로 배치한다.
3. 입력창, 프리셋 선택, 색상 선택, export 버튼을 명확하게 구성한다.
4. scan reliability status를 사용자가 이해하기 쉽게 표시한다.
5. 빈 상태, 로딩 상태, 에러 상태를 모두 디자인한다.
6. 접근성 속성을 추가한다.
7. 키보드 사용성을 개선한다.
8. 다크/라이트 테마 중 최소 1개를 완성도 있게 제공한다.
9. 제품명, tagline, footer, privacy link를 포함한다.
10. 한국어/영어 확장이 가능하도록 문구를 분리한다.

완료 기준:
- 첫 방문자가 설명 없이도 QR 생성, 보기 전환, 저장을 할 수 있음
- 모바일 화면에서 버튼/입력 영역이 불편하지 않음
- UI가 데모가 아니라 제품처럼 보임
```

---

# Goal 9 — Capacitor Mobile Packaging

```txt
/goal
완성된 웹앱을 Capacitor로 Android 앱 패키징해줘.

요구사항:
1. Capacitor를 설치하고 Android 프로젝트를 추가한다.
2. 앱 이름, package id, 아이콘, splash를 설정한다.
3. WebView에서 Three.js 렌더링이 안정적으로 동작하는지 확인한다.
4. Android back button 동작을 정의한다.
5. 파일 저장/공유 기능을 Capacitor 환경에 맞게 보완한다.
6. Android 권한은 최소화한다.
7. 인터넷 권한이 필요한지 검토한다.
   - 완전 오프라인 앱이면 제거 또는 최소화
   - 외부 링크/정책 페이지가 필요하면 명확히 유지
8. release build 구성을 준비한다.
9. AAB 생성 방법을 README에 작성한다.

완료 기준:
- Android Studio에서 release build 가능
- 실제 기기에서 렌더링/공유/저장 테스트 가능
- Play Store 업로드용 AAB 생성 가능
```

---

# Goal 10 — Release Hardening & Store Submission

```txt
/goal
Cherry Blossom QR Art 앱을 실제 배포 가능한 수준으로 릴리즈 하드닝해줘.

요구사항:
1. 개인정보 처리방침 페이지를 작성한다.
2. 이용약관 또는 간단한 사용 안내 페이지를 작성한다.
3. 오픈소스 라이선스 고지 화면을 만든다.
4. 앱 버전과 빌드 번호 관리 방식을 정한다.
5. Sentry 같은 외부 추적 도구는 기본 제외한다. 필요하면 opt-in 구조로만 설계한다.
6. Play Store 등록 정보 초안을 작성한다.
   - 앱 이름
   - 짧은 설명
   - 긴 설명
   - 스크린샷 구성
   - 개인정보 수집 여부
7. Lighthouse 또는 유사한 웹 품질 점검을 수행한다.
8. Playwright E2E 테스트를 추가한다.
9. 실제 QR 스캔 수동 QA 체크리스트를 작성한다.
10. release checklist를 README에 추가한다.

완료 기준:
- 웹 배포 가능
- Android AAB 배포 가능
- 스토어 등록에 필요한 문서와 체크리스트가 준비됨
```
