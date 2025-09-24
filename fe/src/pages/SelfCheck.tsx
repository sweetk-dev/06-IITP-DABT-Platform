import { Routes, Route } from 'react-router-dom';
import { SelfCheckStart } from './self-check/SelfCheckStart';
import { SelfCheckQuestions } from './self-check/SelfCheckQuestions';
import { SelfCheckResult } from './self-check/SelfCheckResult';
import { SelfCheckMore } from './self-check/SelfCheckMore';

export function SelfCheck() {
  return (
    <Routes>
      <Route path="start" element={<SelfCheckStart />} />
      <Route path="questions" element={<SelfCheckQuestions />} />
      <Route path="result" element={<SelfCheckResult />} />
      <Route path="more" element={<SelfCheckMore />} />
    </Routes>
  );
}
