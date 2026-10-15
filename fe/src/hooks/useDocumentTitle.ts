import { useEffect } from 'react';

/**
 * 사이트 이름 — 브라우저 탭 제목의 공통 꼬리말이자 홈 화면의 제목.
 * (헤더 로고 문구와 같은 값)
 */
export const SITE_NAME = '장애인 자립 지원 허브';

/**
 * 화면별 문서 제목(document.title)을 설정한다.
 *
 * [2026-10 접근성 · KWCAG 2.2 "제목 제공" / WCAG 2.4.2 Page Titled]
 * 기존에는 모든 화면의 탭 제목이 index.html 의 "DABT Platform" 하나로 고정되어
 * 스크린리더 사용자가 화면이 바뀌었는지, 지금 어느 화면인지 알 수 없었다.
 * SPA 는 화면 전환 시 문서를 새로 읽지 않으므로 화면(라우트)마다 직접 바꿔 줘야 한다.
 *
 * 형식: "<화면 제목> | 장애인 자립 지원 허브" (화면 제목이 없으면 사이트 이름만)
 *
 * @param pageTitle 화면 제목. 데이터 상세처럼 비동기로 정해지는 경우 로딩 중에는 undefined 를 넘기면
 *                  사이트 이름만 표시하고, 값이 오면 다시 설정된다.
 */
export function useDocumentTitle(pageTitle?: string | null) {
  useEffect(() => {
    const trimmed = (pageTitle || '').trim();
    document.title = trimmed && trimmed !== SITE_NAME ? `${trimmed} | ${SITE_NAME}` : SITE_NAME;
  }, [pageTitle]);
}
