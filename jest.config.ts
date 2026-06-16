import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Swiper 등 CSS 파일 임포트 에러 해결을 위한 매퍼 설정
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // CSS 파일 임포트 시 에러 방지: 빈 객체 모듈로 대체
    "^swiper/css$": "<rootDir>/__mocks__/styleMock.ts",
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.ts",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default async function jestConfig() {
  const makeConfig = createJestConfig(config);
  const finalConfig = await makeConfig();

  finalConfig.transformIgnorePatterns = ["/node_modules/(?!(swiper|dom7)/)"];

  return finalConfig;
}
