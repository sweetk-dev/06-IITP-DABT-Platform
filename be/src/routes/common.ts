// 공통 API 라우트 - 완벽한 모듈화 (common 패키지 완전 활용)
import { Router } from 'express';
import { commonController } from '../controllers/common';
import { validateRequest, commonSchemas } from '../middleware/validator';
import { asyncHandler } from '../middleware/errorHandler';
import { API_URLS } from '@iitp-dabt-platform/common';

const router = Router();

// ============================================================================
// 헬스 체크 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/health
 * @desc 서버 상태 확인
 * @access Public
 */
router.get(
  API_URLS.COMMON.HEALTH_CHECK,
  validateRequest({
    query: commonSchemas.paginationQuery.pick({ page: true, pageSize: true }).optional(),
  }),
  asyncHandler(commonController.getHealth)
);

// ============================================================================
// 버전 정보 API - common 패키지의 API_URLS 활용
// ============================================================================

/**
 * @route GET /api/v1/version
 * @desc 서버 버전 정보 조회
 * @access Public
 */
router.get(
  API_URLS.COMMON.VERSION,
  validateRequest({
    query: commonSchemas.paginationQuery.pick({ page: true, pageSize: true }).optional(),
  }),
  asyncHandler(commonController.getVersion)
);

export { router as commonRoutes };
