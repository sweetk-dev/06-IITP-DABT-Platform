import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';

// Lazy load pages for better performance
const Home = lazy(() => import('./Home').then(m => ({ default: m.Home })));
const DataList = lazy(() => import('./DataList').then(m => ({ default: m.DataList })));
const DataSearch = lazy(() => import('./DataSearch').then(m => ({ default: m.DataSearch })));
const DataDetail = lazy(() => import('./DataDetail').then(m => ({ default: m.DataDetail })));
const Info = lazy(() => import('./Info').then(m => ({ default: m.Info })));
const SelfCheck = lazy(() => import('./SelfCheck').then(m => ({ default: m.SelfCheck })));

// Loading fallback component
function PageLoader() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <Spinner size="l" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data-list" element={<DataList />} />
        <Route path="/data-search" element={<DataSearch />} />
        <Route path="/data/:id" element={<DataDetail />} />
        <Route path="/info" element={<Info />} />
        <Route path="/self-check/*" element={<SelfCheck />} />
      </Routes>
    </Suspense>
  );
}


