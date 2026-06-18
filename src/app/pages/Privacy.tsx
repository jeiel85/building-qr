import { APP_NAME } from '@/shared/constants/app';
import { useTranslation } from '@/i18n';

export function PrivacyPage() {
  const { locale } = useTranslation();

  if (locale === 'en') {
    return (
      <article className="doc">
        <h1>Privacy Policy</h1>
        <p>
          {APP_NAME} <strong>does not collect your personal information.</strong> All QR generation
          runs locally on your device.
        </p>

        <h2>Information we collect</h2>
        <p>None. There is no account or sign-up, and we never ask for your name, email, or contacts.</p>

        <h2>Your link / text</h2>
        <p>
          The URL or text you enter <strong>is not sent to any server.</strong> Matrix generation, 3D
          rendering, and image export all happen on your device.
        </p>

        <h2>Storage</h2>
        <p>There is no server storage. Images you save go only to your own device.</p>

        <h2>Ads &amp; tracking</h2>
        <p>No ad SDKs and no tools that identify or track individuals.</p>

        <h2>Web visit analytics</h2>
        <p>
          On the website (building-qr.vercel.app) only, we use <strong>cookieless, anonymous</strong>{' '}
          visit analytics (Vercel Web Analytics) to gauge traffic. No personal data or cookies are
          collected and there is no cross-site tracking. <strong>The Android app collects none of
          this.</strong>
        </p>

        <h2>Permissions (Android app)</h2>
        <p>
          Internet permission is used for opening external links (such as this policy or GitHub) and
          app operation. QR generation itself uses no network.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Open an issue on{' '}
          <a href="https://github.com/jeiel85/building-qr" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>

        <p className="doc-meta">Last updated: 2026-06-18</p>
      </article>
    );
  }

  return (
    <article className="doc">
      <h1>개인정보 처리방침</h1>
      <p>
        {APP_NAME}은 사용자의 개인정보를 <strong>수집하지 않습니다.</strong> 모든 QR 생성은 사용자의
        기기에서 로컬로 수행됩니다.
      </p>

      <h2>수집하는 정보</h2>
      <p>없습니다. 계정·로그인·회원가입이 없으며, 이름·이메일·연락처 등 어떤 개인정보도 받지 않습니다.</p>

      <h2>입력한 링크/텍스트</h2>
      <p>
        QR로 만들기 위해 입력한 URL이나 텍스트는 <strong>외부 서버로 전송되지 않습니다.</strong> QR
        매트릭스 생성과 3D 렌더링, 이미지 저장은 모두 기기 안에서 처리됩니다.
      </p>

      <h2>저장</h2>
      <p>
        서버 저장이 없습니다. 사용자가 “저장”한 이미지는 사용자의 기기(문서함·갤러리 등)에만 저장됩니다.
      </p>

      <h2>광고·추적</h2>
      <p>광고 SDK와 개인을 식별·추적하는 도구를 사용하지 않습니다.</p>

      <h2>웹 방문 통계</h2>
      <p>
        웹사이트(building-qr.vercel.app)에 한해, 방문 규모 파악을 위해 <strong>쿠키 없는 익명 집계</strong>
        방식의 방문 통계(Vercel Web Analytics)를 사용합니다. 개인정보(PII)나 쿠키를 수집하지 않으며, 다른
        사이트와 연동된 추적도 하지 않습니다. <strong>Android 앱에서는 이 통계도 수집하지 않습니다.</strong>
      </p>

      <h2>권한 (Android 앱)</h2>
      <p>
        인터넷 권한은 외부 링크(예: 본 방침 페이지, GitHub) 열기와 앱 동작에 사용됩니다. QR 생성 자체는
        네트워크를 사용하지 않습니다.
      </p>

      <h2>문의</h2>
      <p>
        문의는 GitHub 저장소(
        <a href="https://github.com/jeiel85/building-qr" target="_blank" rel="noopener noreferrer">
          github.com/jeiel85/building-qr
        </a>
        )의 이슈로 받습니다.
      </p>

      <p className="doc-meta">최종 업데이트: 2026-06-18</p>
    </article>
  );
}
