import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';

export function NotFoundPage() {
  const { locale } = useTranslation();
  const en = locale === 'en';

  return (
    <article className="doc">
      <h1>{en ? 'Page not found' : '페이지를 찾을 수 없습니다'}</h1>
      <p>{en ? "That address doesn't exist." : '요청하신 주소가 존재하지 않습니다.'}</p>
      <p>
        <Link className="btn" to="/">
          {en ? 'Go home' : '홈으로'}
        </Link>
      </p>
    </article>
  );
}
