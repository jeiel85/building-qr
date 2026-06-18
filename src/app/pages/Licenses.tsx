import { APP_NAME } from '@/shared/constants/app';
import { useTranslation } from '@/i18n';

interface Library {
  name: string;
  license: string;
  url: string;
}

const LIBRARIES: Library[] = [
  { name: 'React · React DOM', license: 'MIT', url: 'https://github.com/facebook/react' },
  { name: 'React Router', license: 'MIT', url: 'https://github.com/remix-run/react-router' },
  { name: 'Three.js', license: 'MIT', url: 'https://github.com/mrdoob/three.js' },
  { name: 'qrcode', license: 'MIT', url: 'https://github.com/soldair/node-qrcode' },
  { name: 'Zustand', license: 'MIT', url: 'https://github.com/pmndrs/zustand' },
  { name: 'Capacitor', license: 'MIT', url: 'https://github.com/ionic-team/capacitor' },
  { name: 'Vite', license: 'MIT', url: 'https://github.com/vitejs/vite' },
  { name: 'Vercel Analytics', license: 'MIT', url: 'https://github.com/vercel/analytics' },
  { name: 'Pretendard', license: 'SIL OFL 1.1', url: 'https://github.com/orioncactus/pretendard' },
];

export function LicensesPage() {
  const { locale } = useTranslation();
  const en = locale === 'en';

  return (
    <article className="doc">
      <h1>{en ? 'Open-source licenses' : '오픈소스 라이선스'}</h1>
      <p>
        {en
          ? `${APP_NAME} uses the following open-source software. See each link for the full license text.`
          : `${APP_NAME}은 다음 오픈소스 소프트웨어를 사용합니다. 각 라이선스의 전문은 링크를 참고하세요.`}
      </p>
      <ul className="license-list">
        {LIBRARIES.map((lib) => (
          <li key={lib.name}>
            <a href={lib.url} target="_blank" rel="noopener noreferrer">
              {lib.name}
            </a>
            <span className="license-tag">{lib.license}</span>
          </li>
        ))}
      </ul>
      <p className="doc-meta">
        {en
          ? `${APP_NAME}'s own code is released under the MIT License. A full dependency-license audit (license-checker) is run before store submission.`
          : `${APP_NAME} 자체 코드는 MIT 라이선스로 공개됩니다. 출시 전 license-checker로 전체 의존성 라이선스를 자동 점검합니다.`}
      </p>
    </article>
  );
}
