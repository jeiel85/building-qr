import { Link, Outlet } from 'react-router-dom';
import { APP_NAME } from '@/shared/constants/app';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="wrap inner">
          <Link className="brand" to="/" aria-label={`${APP_NAME} 홈`}>
            <img src="/favicon.svg" alt="" width={26} height={26} />
            {APP_NAME}
          </Link>
          <nav>
            <Link to="/about">소개</Link>
            <Link to="/privacy">개인정보</Link>
            <a href="https://github.com/jeiel85/building-qr" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <div className="wrap">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <div className="wrap inner">
          <span>© 2026 {APP_NAME} · 계정·서버 없이 기기에서 로컬 생성</span>
          <nav className="foot-links">
            <Link to="/about">소개</Link>
            <Link to="/privacy">개인정보</Link>
            <Link to="/terms">이용안내</Link>
            <Link to="/licenses">라이선스</Link>
            <a
              href="https://github.com/jeiel85/building-qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
