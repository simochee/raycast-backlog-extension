import { format } from "date-fns";

export const groupByDate = <T extends { updated: string }>(items: T[]) => {
  return items.reduce<
    {
      label: string;
      items: T[];
    }[]
  >((acc, item) => {
    const label = format(item.updated, "MMM. i, yyyy");
    const existingGroup = acc.find((g) => g.label === label);

    if (existingGroup) {
      existingGroup.items.push(item);
      return acc;
    }

    return acc.concat({
      label,
      items: [item],
    });
  }, []);
};
