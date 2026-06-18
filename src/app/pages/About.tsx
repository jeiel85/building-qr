import { APP_NAME, APP_TAGLINE } from '@/shared/constants/app';

export function AboutPage() {
  return (
    <article className="doc">
      <h1>{APP_NAME} 소개</h1>
      <p>{APP_TAGLINE}.</p>
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
