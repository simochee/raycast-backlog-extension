import { format } from "date-fns";

export const groupByDate = <K extends "updated" | "created", T extends { [key in K]: string }>(key: K, items: T[]) => {
  return items.reduce<
    {
      label: string;
      items: T[];
    }[]
  >((acc, item) => {
    const label = format(item[key], "MMM. i, yyyy");
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
