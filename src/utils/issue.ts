import { differenceInDays, format, parseISO } from "date-fns";

export const buildDueDate = (date: string | undefined) => {
  if (!date) return;

  const now = new Date();
  const dueDate = parseISO(date);
  const diffDays = differenceInDays(dueDate, now);

  return {
    formatted:
      diffDays === 0
        ? "Today"
        : diffDays === 1
          ? "Tomorrow"
          : diffDays === -1
            ? "Yesterday"
            : format(dueDate, "MMM. i, yyyy"),
    past: diffDays < 0,
  };
};