/**
 * @file YYC³ Design System — App Component
 * @description 主应用组件
 * @module App
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-28
 */

import { Routes, Route } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { PWAProvider } from './components/PWAProvider';
import { Layout } from './components/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { TokensPage } from './pages/TokensPage';
import { TokenManagerPage } from './pages/TokenManagerPage';
import { ThemeCustomizerPage } from './pages/ThemeCustomizerPage';
import { BuildSettingsPage } from './pages/BuildSettingsPage';
import { QADashboardPage } from './pages/QADashboardPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { AlignmentPage } from './pages/AlignmentPage';
import { RouteApiGuidePage } from './pages/RouteApiGuidePage';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PWAProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<OverviewPage />} />
              <Route path="components" element={<ComponentsPage />} />
              <Route path="tokens" element={<TokensPage />} />
              <Route path="token-manager" element={<TokenManagerPage />} />
              <Route path="theme-customizer" element={<ThemeCustomizerPage />} />
              <Route path="build-settings" element={<BuildSettingsPage />} />
              <Route path="qa" element={<QADashboardPage />} />
              <Route path="playground" element={<PlaygroundPage />} />
              <Route path="alignment" element={<AlignmentPage />} />
              <Route path="route-api" element={<RouteApiGuidePage />} />
            </Route>
          </Routes>
        </PWAProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
