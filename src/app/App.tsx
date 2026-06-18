import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AppRoutes } from './routes';

export function App() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let remove: (() => void) | undefined;
    void import('@capacitor/app').then(({ App: CapApp }) => {
      void CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) window.history.back();
        else void CapApp.exitApp();
      }).then((handle) => {
        remove = () => void handle.remove();
      });
    });
    return () => remove?.();
  }, []);

  return <AppRoutes />;
}
