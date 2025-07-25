import type tablerNodesFilled from "@tabler/icons/tabler-nodes-filled.json";
import type tablerNodesOutline from "@tabler/icons/tabler-nodes-outline.json";

type TablerIcon =
  | `tabler/filled/${keyof typeof tablerNodesFilled}.svg`
  | `tabler/outline/${keyof typeof tablerNodesOutline}.svg`;

export const ICONS = {
  EXTERNAL: "tabler/outline/external-link.svg",
  REFRESH: "tabler/outline/refresh.svg",
  MANAGE_SPACES: "tabler/outline/building-cog.svg",
  ADD_SPACE: "tabler/outline/building-plus.svg",
  ADD_FORM: "tabler/filled/circle-plus.svg",
  UPDATE_FORM: "tabler/filled/circle-check.svg",
  DELETE_FORM: "tabler/outline/circle-minus.svg",
  ISSUE: "tabler/outline/list.svg",
  ISSUE_ADD: "tabler/outline/plus.svg",
  ISSUE_EXPIRED: "tabler/filled/flame.svg",
  BOARD: "tabler/outline/layout-kanban.svg",
  GANTT: "tabler/outline/chart-arrows.svg",
  DOCUMENT: "tabler/outline/article.svg",
  WIKI: "tabler/outline/square-letter-w.svg",
  FILE_SHARING: "tabler/outline/folders.svg",
  SUBVERSION: "tabler/outline/versions.svg",
  GIT: "tabler/outline/git-merge.svg",
  DOWNLOADING: "tabler/outline/cloud-down.svg",
  LOADING: "tabler/outline/loader.svg",
  NOTIFICATION_ASSIGNED: "tabler/outline/user-square-rounded.svg",
  NOTIFICATION_COMMENT: "tabler/outline/messages.svg",
  NOTIFICATION_CREATED: "tabler/outline/square-rounded-plus-2.svg",
  NOTIFICATION_UPDATED: "tabler/outline/info-square-rounded.svg",
  NOTIFICATION_FILE_ADDED: "tabler/outline/file-plus.svg",
  NOTIFICATION_USER_ADDED: "tabler/outline/users-plus.svg",
  NOTIFICATION_PULL_REQUEST_ASSIGNED: "tabler/outline/user-plus.svg",
  NOTIFICATION_PULL_REQUEST_COMMENT: "tabler/outline/message.svg",
  NOTIFICATION_PULL_REQUEST_CREATED: "tabler/outline/git-pull-request.svg",
  NOTIFICATION_PULL_REQUEST_UPDATED: "tabler/outline/git-pull-request-draft.svg",
  NOTIFICATION_OTHER: "tabler/outline/point.svg",
  STAR_EMPTY: "tabler/outline/star.svg",
  STAR_FILLED: "tabler/filled/star.svg",
  DATE_START: "tabler/outline/calendar.svg",
  DATE_DUE: "tabler/outline/calendar-due.svg",
  CATEGORY: "tabler/outline/category.svg",
  MILESTONE: "tabler/outline/map-pin.svg",
  VERSION: "tabler/outline/rocket.svg",
  ESTIMATED_HOURS: "tabler/outline/clock-question.svg",
  ACTUAL_HOURS: "tabler/outline/clock-check.svg",
  RESOLUTION: "tabler/outline/bulb.svg",
} satisfies Record<string, TablerIcon>;
