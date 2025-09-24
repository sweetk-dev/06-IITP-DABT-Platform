// Common types for the application

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// Theme types
export type ThemeType = 'physical' | 'emotional' | 'economic' | 'social';
export type DataType = 'basic' | 'mobility' | 'employment';
export type SelfCheckStep = 'start' | 'questions' | 'result' | 'more';

// UI Component types
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 's' | 'm' | 'l';
export type SpinnerSize = 's' | 'm' | 'l';

// Data types
export interface DataItem extends BaseEntity {
  title: string;
  description: string;
  theme: ThemeType;
  dataType: DataType;
  sourceOrg: string;
  format: string[];
  size: string;
  lastModified: string;
  tags: string[];
  downloadCount: number;
  viewCount: number;
}

export interface SelfCheckQuestion {
  id: string;
  category: ThemeType;
  question: string;
  options: {
    value: number;
    label: string;
  }[];
}

export interface SelfCheckResult {
  scores: Record<ThemeType, number>;
  recommendations: Recommendation[];
  totalScore: number;
  level: 'basic' | 'partial' | 'complete';
}

export interface Recommendation {
  id: string;
  type: 'policy' | 'provider' | 'facility';
  title: string;
  description: string;
  category: ThemeType;
  url?: string;
  contact?: string;
}

// Filter types
export interface DataFilter {
  theme?: ThemeType;
  dataType?: DataType;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'downloadCount';
  sortOrder?: 'asc' | 'desc';
}

// Navigation types
export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  children?: MenuItem[];
}
