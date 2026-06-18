import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/shared/components/Layout';
import { BuildingQrScreen } from '@/features/building-qr';
import { AboutPage } from './pages/About';
import { PrivacyPage } from './pages/Privacy';
import { NotFoundPage } from './pages/NotFound';

/**
 * Single-product routing today, structured so pricing/about/privacy pages
 * slot in without reshaping the app.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<BuildingQrScreen />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
