# 07. Release Quality Checklist

## 기능 품질

- [ ] URL 입력 가능
- [ ] 짧은 텍스트 입력 가능
- [ ] QR matrix 생성 가능
- [ ] 2D scan preview 가능
- [ ] 3D art view 가능
- [ ] 3D ↔ 2D 전환 가능
- [ ] PNG export 가능
- [ ] 모바일 공유 가능
- [ ] 긴 입력 경고 가능
- [ ] WebGL fallback 가능
- [ ] 최근 생성값 복구 가능

## QR 스캔 품질

- [ ] iPhone 기본 카메라 스캔
- [ ] Android 기본 카메라 스캔
- [ ] Samsung Camera 스캔
- [ ] Google Lens 스캔
- [ ] export 이미지 스캔
- [ ] 화면 밝기 50%에서 스캔
- [ ] 저사양 폰에서 스캔
- [ ] 긴 URL warning 확인
- [ ] quiet zone 확인
- [ ] finder pattern 왜곡 없음

## 성능

- [ ] 데스크톱 60fps 근접
- [ ] 모바일 30fps 이상
- [ ] 렌더러 dispose 확인
- [ ] memory leak 없음
- [ ] matrix size 제한 동작
- [ ] devicePixelRatio 제한
- [ ] 저사양 fallback

## 접근성

- [ ] 버튼 label
- [ ] 입력창 label
- [ ] keyboard navigation
- [ ] reduced motion 대응
- [ ] 색상 대비
- [ ] 스크린 리더 기본 설명

## 보안/개인정보

- [ ] 입력값 서버 전송 없음
- [ ] 로그인 없음
- [ ] analytics 없음 또는 명시적 opt-in
- [ ] 개인정보 처리방침
- [ ] 외부 네트워크 요청 최소화
- [ ] CSP 검토
- [ ] dependency audit

## 배포

- [ ] npm run build 성공
- [ ] npm run typecheck 성공
- [ ] npm run test 성공
- [ ] npm run test:e2e 성공
- [ ] Vercel 배포 확인
- [ ] Capacitor Android build 성공
- [ ] AAB 생성
- [ ] Play Store listing 초안
- [ ] 스크린샷 준비
- [ ] 앱 아이콘 준비
