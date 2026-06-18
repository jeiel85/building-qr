import { APP_NAME } from '@/shared/constants/app';

export function PrivacyPage() {
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
