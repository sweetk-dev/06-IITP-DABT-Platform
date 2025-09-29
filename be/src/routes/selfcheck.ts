// 자가진단 관련 API 라우트 - 완벽한 모듈화 (common 패키지 완전 활용)
import { Router } from 'express';
import { selfCheckController } from '../controllers/selfcheck/selfCheckController';
import { validateRequest, commonSchemas } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';
import { API_URLS } from '@iitp-dabt-platform/common';

const router = Router();

// ============================================================================
// 자가진단 정책 관련 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/selfcheck/recommendations
 * @desc 추천 정책 리스트 조회
 * @access Public
 */
router.get(
  API_URLS.SELF_CHK.RECOMMENDATIONS,
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
  API_URLS.SELF_CHK.POLICIES,
  validateRequest({
    query: commonSchemas.selfCheckQuery,
  }),
  asyncHandler(selfCheckController.getPolicies)
);

// ============================================================================
// 자가진단 기관 관련 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/selfcheck/providers
 * @desc 자립 지원 기관 리스트 조회
 * @access Public
 */
router.get(
  API_URLS.SELF_CHK.PROVIDERS,
  validateRequest({
    query: commonSchemas.selfCheckQuery.pick({ page: true, pageSize: true }),
  }),
  asyncHandler(selfCheckController.getProviders)
);

// ============================================================================
// 자가진단 시설 관련 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/selfcheck/facilities
 * @desc 자립 지원 시설 리스트 조회
 * @access Public
 */
router.get(
  API_URLS.SELF_CHK.FACILITIES,
  validateRequest({
    query: commonSchemas.selfCheckQuery.pick({ page: true, pageSize: true }),
  }),
  asyncHandler(selfCheckController.getFacilities)
);

export { router as selfCheckRoutes };
