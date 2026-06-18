import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <article className="doc">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p>요청하신 주소가 존재하지 않습니다.</p>
      <p>
        <Link className="btn" to="/">
          홈으로
        </Link>
      </p>
    </article>
  );
}
