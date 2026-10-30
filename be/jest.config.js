module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  // [v1.2.1] 공유 패키지(@iitp-dabt-platform/common)는 ESM 빌드라 jest(CJS)가 dist 를 못 읽는다.
  // 테스트에서는 TS 원본을 직접 컴파일해 쓰고, 원본의 './x.js' 상대 import 는 확장자를 떼어 해석한다.
  moduleNameMapper: {
    '^@iitp-dabt-platform/common$': '<rootDir>/../packages/common/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
