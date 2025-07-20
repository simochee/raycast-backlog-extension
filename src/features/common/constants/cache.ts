/**
 * Cache TTL (Time To Live) constants by usage
 */
export const CACHE_TTL = {
  // User data - rarely changes
  USER: 1000 * 60 * 60 * 24 * 24,

  // Space and project data - rarely changes
  SPACE: 1000 * 60 * 60 * 24,
  PROJECT: 1000 * 60 * 60 * 24,

  // Repository data - rarely changes
  REPOSITORY: 1000 * 60 * 60 * 24,

  // Recent viewed data - changes frequently
  RECENT_VIEWED_ISSUES: 1000 * 60 * 3,
  RECENT_VIEWED_PROJECTS: 1000 * 60,
  RECENT_VIEWED_WIKIS: 1000 * 60 * 10,

  // My issues data - changes frequently
  MY_ISSUES: 1000 * 60 * 3,

  // Notifications data - changes frequently
  NOTIFICATIONS: 1000 * 60,
  NOTIFICATION_COUNT: 1000 * 60 * 2,

  // Default cache TTL
  DEFAULT: 1000 * 60 * 60 * 24 * 30,
} as const;

/**
 * Delay constants for async operations
 */
export const DELAY = {
  NOTIFICATION_UPDATE: 500,
} as const;
