import { differenceInDays, format, parseISO } from "date-fns";

export const formatDate = (date: string | undefined) => {
  if (!date) return;

  return format(parseISO(date), "MMM. i, yyyy");
};

export const buildDueDate = (date: string | undefined) => {
  if (!date) return;

  const now = new Date();
  const dueDate = parseISO(date);
  const diffDays = differenceInDays(dueDate, now);

  return {
    formatted:
      diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : diffDays === -1 ? "Yesterday" : formatDate(date),
    past: diffDays < 0,
  };
};

export const sortByDisplayOrder = <T extends { displayOrder: number }>(items: Array<T>): Array<T> => {
  return items.toSorted((a, b) => a.displayOrder - b.displayOrder);
};
