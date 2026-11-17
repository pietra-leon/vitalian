// Landing do Vitalian. HashRouter só para as páginas legais (o GitHub Pages
// não faz fallback de rotas); qualquer outro hash é uma âncora da página inicial.
import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import Home from './pages/Home';

const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/termos" element={<Terms />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
