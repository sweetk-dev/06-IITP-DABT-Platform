// 데이터 관련 API 라우트 - 완벽한 모듈화 (common 패키지 완전 활용)
import { Router } from 'express';
import { dataController } from '../controllers/data';
import { validateRequest, commonSchemas } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';
import { API_URLS } from '@iitp-dabt-platform/common';

const router = Router();

// ============================================================================
// 데이터 요약 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/data/summary/latest
 * @desc 최신 데이터 리스트 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.SUMMARY.LATEST,
  validateRequest({
    query: commonSchemas.paginationQuery.pick({ page: true, pageSize: true }).optional(),
  }),
  asyncHandler(dataController.getLatestData)
);

/**
 * @route GET /api/v1/data/counts/themes
 * @desc 자립테마별 데이터 건수 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.COUNTS.THEMES,
  asyncHandler(dataController.getThemeCounts)
);

/**
 * @route GET /api/v1/data/counts/types
 * @desc 데이터 유형별 데이터 건수 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.COUNTS.TYPES,
  asyncHandler(dataController.getTypeCounts)
);

// ============================================================================
// 데이터 검색 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/data/search
 * @desc 데이터 검색
 * @access Public
 */
router.get(
  API_URLS.DATA.SEARCH,
  validateRequest({
    query: commonSchemas.searchQuery,
  }),
  asyncHandler(dataController.searchData)
);

// ============================================================================
// 테마 관련 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/data/themes
 * @desc 자립 테마 리스트 전체 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.THEMES,
  asyncHandler(dataController.getThemes)
);

/**
 * @route GET /api/v1/data/themes/:theme/items
 * @desc 자립 테마별 리스트 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.THEME_ITEMS(':theme'),
  validateRequest({
    params: commonSchemas.themeParam,
    query: commonSchemas.paginationQuery,
  }),
  asyncHandler(dataController.getThemeItems)
);

// ============================================================================
// 데이터 유형 관련 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/data/types
 * @desc 데이터 유형 리스트 전체 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.TYPES,
  asyncHandler(dataController.getTypes)
);

/**
 * @route GET /api/v1/data/types/:type/items
 * @desc 데이터 유형별 리스트 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.TYPE_ITEMS(':type'),
  validateRequest({
    params: commonSchemas.typeParam,
    query: commonSchemas.paginationQuery,
  }),
  asyncHandler(dataController.getTypeItems)
);

// ============================================================================
// 데이터 상세 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/data/:id
 * @desc 데이터 상세 정보 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.DETAIL(':id'),
  validateRequest({
    params: commonSchemas.idParam,
  }),
  asyncHandler(dataController.getDataDetail)
);

/**
 * @route GET /api/v1/data/:id/preview
 * @desc 데이터 미리보기 조회
 * @access Public
 */
router.get(
  API_URLS.DATA.PREVIEW(':id'),
  validateRequest({
    params: commonSchemas.idParam,
    query: commonSchemas.paginationQuery.pick({ page: true, pageSize: true }).optional(),
  }),
  asyncHandler(dataController.getDataPreview)
);

export { router as dataRoutes };
