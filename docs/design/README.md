# Cherry Blossom QR Art — Production Design Bundle

이 문서는 `Cherry Blossom QR Code` 스타일의 QR 아트 생성기를 상용 배포 가능한 수준으로 개발하기 위한 설계 묶음입니다.

## 핵심 방향

- 원본 GitHub 데모 코드를 복사하지 않고, 아이디어와 UX만 참고해 재구현합니다.
- 1차 제품은 웹 기반으로 구현하고, 모바일 앱 배포는 Capacitor로 Android/iOS 패키징합니다.
- 렌더링은 WebGL 기반 Three.js를 1차 표준으로 사용합니다.
- WebGPU는 현재 브라우저 지원과 운영 리스크를 고려해 실험 옵션으로 둡니다.
- QR 스캔 신뢰성을 최우선 품질 기준으로 둡니다.
- MVP가 아니라 스토어 배포 가능한 완성도를 목표로 설계합니다.

## 추천 스택

- Frontend: React + TypeScript + Vite
- 3D Rendering: Three.js + InstancedMesh
- QR: qrcode
- Mobile Packaging: Capacitor
- State: Zustand 또는 React Context
- Styling: Tailwind CSS 또는 CSS Modules
- Export: PNG / WebP / SVG-like metadata JSON
- Test: Vitest + Playwright
- CI/CD: GitHub Actions
- Web Deploy: Vercel
- Android Deploy: Google Play App Bundle
- iOS Deploy: App Store Connect, 필요 시 후속

## 문서 구성

1. `00_product_brief.md`
2. `01_stack_decision.md`
3. `02_architecture.md`
4. `03_rendering_design.md`
5. `04_qr_scan_reliability.md`
6. `05_data_model.md`
7. `06_goal_prompts.md`
8. `07_release_quality_checklist.md`
9. `08_store_and_monetization.md`
10. `09_license_and_risk.md`
11. `10_testing_plan.md`
12. `11_future_roadmap.md`

## 개발 방식

각 단계는 `/goal` 명령으로 진행할 수 있도록 구성되어 있습니다.

권장 순서:

1. Core QR Engine
2. 2D Scan Preview
3. 3D Block Renderer
4. Cherry Blossom Art Generator
5. Camera Transition
6. Export & Share
7. Mobile Packaging
8. Release Hardening
9. Store Submission
