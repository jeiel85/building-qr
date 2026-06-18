# 10. Testing Plan

## Unit Tests

### QR

- generateQrMatrix
- validateQrInput
- quiet zone calculation
- finder pattern detection
- scan reliability scoring

### Art

- deterministic seeded random
- block count cap
- block type mapping
- finder pattern protection
- preset application

### Render

- scene creation
- material generation
- mesh disposal
- camera interpolation
- fallback detection

## Integration Tests

- input → matrix → block data
- input → preview → export
- preset change → renderer update
- view mode transition
- invalid input → error UI

## E2E Tests

Playwright 시나리오:

1. 기본 페이지 로드
2. URL 입력
3. QR preview 표시 확인
4. 3D 보기 표시 확인
5. scan mode 전환
6. PNG export 버튼 클릭
7. 긴 URL 입력 시 warning 표시
8. 모바일 viewport에서 UI 깨짐 없음

## Manual QA

### Device Matrix

- Windows Chrome
- macOS Safari 가능 시
- Android Chrome
- Samsung Internet
- Android Capacitor WebView
- iPhone Safari 가능 시

### QR Scanner Matrix

- iPhone Camera
- Android Camera
- Samsung Camera
- Google Lens
- 카카오톡 QR scanner 가능 시

## Performance QA

- block count 1,000
- block count 3,000
- block count 5,000
- block count 8,000
- low-end mobile fallback
- export 1024
- export 2048
- export 4096

## Release Gate

아래 조건을 만족하지 않으면 출시하지 않습니다.

- scan2d mode가 주요 카메라 앱에서 인식됨
- export 이미지가 다른 기기에서 스캔됨
- build/typecheck/test 통과
- 개인정보 처리방침 준비
- 라이선스 고지 준비
- Android AAB 생성 성공
