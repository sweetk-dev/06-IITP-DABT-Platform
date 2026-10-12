/**
 * public 폴더 정적 파일의 URL 을 배포 기준 경로(Vite base)에 맞춰 만든다.
 *
 * Vite 는 index.html 과 CSS 안의 "/파일명" 경로에는 base 를 자동으로 붙이지만,
 * TSX 안의 문자열("/chat.png", 'url(/contract.png)')은 그대로 둔다.
 * 그래서 사이트를 하위 경로(예: /iitp/platform/)에 배포하면 이미지를 사이트 루트에서
 * 찾게 되어 깨진다. 이 함수로 감싸면 base 가 "/" 일 때는 기존과 같은 "/chat.png",
 * "/iitp/platform/" 일 때는 "/iitp/platform/chat.png" 가 된다.
 *
 * @param path public 폴더 기준 경로. 앞의 "/" 는 있어도 없어도 된다.
 * @returns base 를 붙인 URL (import.meta.env.BASE_URL 은 항상 "/" 로 끝난다)
 */
export const publicAsset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
