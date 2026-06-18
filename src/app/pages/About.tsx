import { APP_NAME } from '@/shared/constants/app';
import { useTranslation } from '@/i18n';

export function AboutPage() {
  const { locale } = useTranslation();

  if (locale === 'en') {
    return (
      <article className="doc">
        <h1>About {APP_NAME}</h1>
        <p>Turn your link into a scannable QR that stands up as a 3D city skyline.</p>
        <p>
          {APP_NAME} turns an ordinary QR code into a shareable 3D city. Dark modules rise as
          buildings, light modules become streets. Looked at from above it is still a scannable QR;
          looked at from an angle it is a skyline where every building is different.
        </p>
        <p>
          To be both pretty and reliable, the 3D art view and the 2D scan view are kept separate.
          Generation runs entirely on your device — no server involved.
        </p>
      </article>
    );
  }

  return (
    <article className="doc">
      <h1>{APP_NAME} 소개</h1>
      <p>링크를 스캔 가능한 3D 빌딩숲 QR 아트로.</p>
      <p>
        {APP_NAME}은 평범한 QR 코드를 스캔 가능한 3D 도시 스카이라인으로 바꿔주는 생성기입니다. 어두운
        모듈은 빌딩으로 솟고, 밝은 모듈은 거리가 됩니다. 위에서 내려다보면 여전히 QR이고, 비스듬히 보면
        한 채 한 채 다른 도시가 됩니다.
      </p>
      <p>
        예쁨과 스캔 신뢰성을 모두 잡기 위해 3D 감상 모드와 2D 스캔 모드를 분리합니다. 생성은 서버 없이
        기기에서 로컬로 수행됩니다.
      </p>
    </article>
  );
}
