import { APP_NAME } from '@/shared/constants/app';
import { useTranslation } from '@/i18n';

export function TermsPage() {
  const { locale } = useTranslation();

  if (locale === 'en') {
    return (
      <article className="doc">
        <h1>Usage Guide</h1>
        <p>Thanks for using {APP_NAME}. Here is a short guide.</p>

        <h2>What it's for</h2>
        <p>
          {APP_NAME} turns a link or short text into a scannable QR code and a 3D building-skyline
          artwork. You may use it freely for personal and commercial purposes.
        </p>

        <h2>Scan reliability</h2>
        <p>
          The 3D view is for looks and does not guarantee scanning. For real scanning, use the{' '}
          <strong>black-and-white 2D export</strong>. Longer input makes the QR more complex and
          harder to read, so prefer short URLs.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The tool is provided “as is”. We do not warrant scan success or any outcome of use. For
          important uses, test the scan yourself before printing or distributing.
        </p>

        <h2>Content</h2>
        <p>You are responsible for the legality and rights of the links/text you enter.</p>

        <p className="doc-meta">Last updated: 2026-06-18</p>
      </article>
    );
  }

  return (
    <article className="doc">
      <h1>이용 안내</h1>
      <p>{APP_NAME}을 사용해 주셔서 감사합니다. 아래는 간단한 사용 안내입니다.</p>

      <h2>용도</h2>
      <p>
        {APP_NAME}은 링크나 짧은 텍스트를 스캔 가능한 QR 코드이자 3D 빌딩숲 아트로 만들어 주는 도구입니다.
        개인·상업 목적 모두 자유롭게 사용할 수 있습니다.
      </p>

      <h2>스캔 신뢰성</h2>
      <p>
        3D 보기는 감상용이며 스캔을 보장하지 않습니다. 실제 스캔에는 <strong>흑백 2D 내보내기</strong>를
        권장합니다. 입력이 길수록 QR이 복잡해져 인식이 어려워질 수 있으니 짧은 URL 사용을 권장합니다.
      </p>

      <h2>책임의 한계</h2>
      <p>
        본 도구는 “있는 그대로(as is)” 제공됩니다. 생성된 QR의 스캔 성공 여부나 사용 결과에 대해 보증하지
        않습니다. 중요한 용도에는 인쇄·배포 전에 직접 스캔 테스트를 해 주세요.
      </p>

      <h2>콘텐츠</h2>
      <p>입력하는 링크/텍스트의 적법성과 권리는 사용자에게 있습니다.</p>

      <p className="doc-meta">최종 업데이트: 2026-06-18</p>
    </article>
  );
}
