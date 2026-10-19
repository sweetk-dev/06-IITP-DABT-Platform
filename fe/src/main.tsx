import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './pages/App';
import './styles/globals.css';
import './styles/components.css';
// [2026-10] 반응형 골격·접근성 공통 스타일 (Layout, 헤더 검색, 자가진단 패널, 초점 표시 등)
import './styles/layout.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 하위 경로 배포(예: /iitp/platform/) 대응 — Vite base 를 라우터 기준 경로로 사용. base 가 "/" 이면 기존과 동일 */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


