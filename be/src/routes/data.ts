// 데이터 관련 API 라우트 - 완벽한 모듈화
import { Router } from 'express';
import { dataController } from '../controllers/data';
import { validateRequest, commonSchemas } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// ============================================================================
// 데이터 요약 API
// ============================================================================

/**
 * @route GET /api/v1/data/summary/latest
 * @desc 최신 데이터 리스트 조회
 * @access Public
 */
router.get(
  '/summary/latest',
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
  '/counts/themes',
  asyncHandler(dataController.getThemeCounts)
);

/**
 * @route GET /api/v1/data/counts/types
 * @desc 데이터 유형별 데이터 건수 조회
 * @access Public
 */
router.get(
  '/counts/types',
  asyncHandler(dataController.getTypeCounts)
);

// ============================================================================
// 데이터 검색 API
// ============================================================================

/**
 * @route GET /api/v1/data/search
 * @desc 데이터 검색
 * @access Public
 */
router.get(
  '/search',
  validateRequest({
    query: commonSchemas.searchQuery,
  }),
  asyncHandler(dataController.searchData)
);

// ============================================================================
// 테마 관련 API
// ============================================================================

/**
 * @route GET /api/v1/data/themes
 * @desc 자립 테마 리스트 전체 조회
 * @access Public
 */
router.get(
  '/themes',
  asyncHandler(dataController.getThemes)
);

/**
 * @route GET /api/v1/data/themes/:theme/items
 * @desc 자립 테마별 리스트 조회
 * @access Public
 */
router.get(
  '/themes/:theme/items',
  validateRequest({
    params: commonSchemas.themeParam,
    query: commonSchemas.paginationQuery,
  }),
  asyncHandler(dataController.getThemeItems)
);

// ============================================================================
// 데이터 유형 관련 API
// ============================================================================

/**
 * @route GET /api/v1/data/types
 * @desc 데이터 유형 리스트 전체 조회
 * @access Public
 */
router.get(
  '/types',
  asyncHandler(dataController.getTypes)
);

/**
 * @route GET /api/v1/data/types/:type/items
 * @desc 데이터 유형별 리스트 조회
 * @access Public
 */
router.get(
  '/types/:type/items',
  validateRequest({
    params: commonSchemas.typeParam,
    query: commonSchemas.paginationQuery,
  }),
  asyncHandler(dataController.getTypeItems)
);

// ============================================================================
// 데이터 상세 API
// ============================================================================

/**
 * @route GET /api/v1/data/:id
 * @desc 데이터 상세 정보 조회
 * @access Public
 */
router.get(
  '/:id',
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
  '/:id/preview',
  validateRequest({
    params: commonSchemas.idParam,
    query: commonSchemas.paginationQuery.pick({ page: true, pageSize: true }).optional(),
  }),
  asyncHandler(dataController.getDataPreview)
);

export { router as dataRoutes };
