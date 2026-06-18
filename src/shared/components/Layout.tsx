import { Link, Outlet } from 'react-router-dom';
import { APP_NAME } from '@/shared/constants/app';
import { LanguageSwitch, useTranslation } from '@/i18n';

export function Layout() {
  const { t } = useTranslation();
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="wrap inner">
          <Link className="brand" to="/" aria-label={t('nav.home')}>
            <img src="/favicon.svg" alt="" width={26} height={26} />
            {APP_NAME}
          </Link>
          <nav>
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/privacy">{t('nav.privacy')}</Link>
            <a href="https://github.com/jeiel85/building-qr" target="_blank" rel="noopener noreferrer">
              {t('nav.github')}
            </a>
            <LanguageSwitch />
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
          <span>
            © 2026 {APP_NAME} · {t('footer.local')}
          </span>
          <nav className="foot-links">
            <Link to="/about">{t('nav.about')}</Link>
            <Link to="/privacy">{t('nav.privacy')}</Link>
            <Link to="/terms">{t('nav.terms')}</Link>
            <Link to="/licenses">{t('nav.licenses')}</Link>
            <a
              href="https://github.com/jeiel85/building-qr"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('nav.github')}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
