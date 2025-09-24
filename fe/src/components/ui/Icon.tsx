import React from 'react';

export type IconName = 
  | 'search-line'
  | 'arrow-right-s-line'
  | 'open-arm-line'
  | 'image-line'
  | 'question-line'
  | 'arrow-left-line'
  | 'arrow-right-line'
  | 'check-fill'
  | 'error-warning-fill'
  | 'check-line'
  | 'close-line'
  | 'wallet-3-line'
  | 'mental-health-line'
  | 'parent-line'
  | 'arrow-right-up-line';

interface IconProps {
  name: IconName;
  size?: 's' | 'm' | 'l' | 'xl';
  color?: string;
  className?: string;
  id?: string;
}

const iconSizes = {
  s: '16px',
  m: '20px',
  l: '24px',
  xl: '32px'
};

export function Icon({ name, size = 'm', color = 'currentColor', className, id }: IconProps) {
  const iconSize = iconSizes[size];
  
  // Figma 아이콘들을 SVG로 구현
  const iconPaths: Record<IconName, string> = {
    'search-line': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    'arrow-right-s-line': 'M13 7l5 5-5 5M6 12h12',
    'open-arm-line': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'image-line': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l2.586-2.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    'question-line': 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'arrow-left-line': 'M19 12H5m7-7l-7 7 7 7',
    'arrow-right-line': 'M5 12h14m-7-7l7 7-7 7',
    'check-fill': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'error-warning-fill': 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z',
    'check-line': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'close-line': 'M6 18L18 6M6 6l12 12',
    'wallet-3-line': 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-2M9 12h6',
    'mental-health-line': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'parent-line': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    'arrow-right-up-line': 'M7 17L17 7m0 0H9m8 0v8'
  };

  return (
    <svg
      id={id}
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
