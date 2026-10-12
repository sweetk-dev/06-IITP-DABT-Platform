import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './pages/App';
import './styles/globals.css';
import './styles/components.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 하위 경로 배포(예: /iitp/platform/) 대응 — Vite base 를 라우터 기준 경로로 사용. base 가 "/" 이면 기존과 동일 */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


