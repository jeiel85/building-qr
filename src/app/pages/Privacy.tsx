import { APP_NAME } from '@/shared/constants/app';

export function PrivacyPage() {
  return (
    <article className="doc">
      <h1>개인정보 처리방침</h1>
      <p>{APP_NAME}은 사용자의 개인정보를 수집하지 않습니다.</p>
      <ul>
        <li>계정·로그인이 없습니다.</li>
        <li>서버 저장이 없습니다.</li>
        <li>입력한 링크/텍스트를 외부로 전송하지 않습니다 — QR 생성은 전적으로 기기에서 수행됩니다.</li>
        <li>광고 SDK·분석 SDK를 사용하지 않습니다.</li>
      </ul>
      <p>정식 문서는 Phase 10(릴리즈 하드닝)에서 확정됩니다.</p>
    </article>
  );
}
