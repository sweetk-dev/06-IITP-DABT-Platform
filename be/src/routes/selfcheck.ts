// 자가진단 관련 API 라우트 - 완벽한 모듈화
import { Router } from 'express';
import { selfCheckController } from '../controllers/selfcheck';
import { validateRequest, commonSchemas } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// ============================================================================
// 자가진단 정책 관련 API
// ============================================================================

/**
 * @route GET /api/v1/selfcheck/recommendations
 * @desc 추천 정책 리스트 조회
 * @access Public
 */
router.get(
  '/recommendations',
  validateRequest({
    query: commonSchemas.selfCheckQuery,
  }),
  asyncHandler(selfCheckController.getRecommendations)
);

/**
 * @route GET /api/v1/selfcheck/policies
 * @desc 자립 지원 정책 리스트 조회
 * @access Public
 */
router.get(
  '/policies',
  validateRequest({
    query: commonSchemas.selfCheckQuery,
  }),
  asyncHandler(selfCheckController.getPolicies)
);

// ============================================================================
// 자가진단 기관 관련 API
// ============================================================================

/**
 * @route GET /api/v1/selfcheck/providers
 * @desc 자립 지원 기관 리스트 조회
 * @access Public
 */
router.get(
  '/providers',
  validateRequest({
    query: commonSchemas.selfCheckQuery.pick({ page: true, pageSize: true }),
  }),
  asyncHandler(selfCheckController.getProviders)
);

// ============================================================================
// 자가진단 시설 관련 API
// ============================================================================

/**
 * @route GET /api/v1/selfcheck/facilities
 * @desc 자립 지원 시설 리스트 조회
 * @access Public
 */
router.get(
  '/facilities',
  validateRequest({
    query: commonSchemas.selfCheckQuery.pick({ page: true, pageSize: true }),
  }),
  asyncHandler(selfCheckController.getFacilities)
);

export { router as selfCheckRoutes };
