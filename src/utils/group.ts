import { format } from "date-fns";

export const groupByDate = <TKey extends "updated" | "created", TItem extends { [key in TKey]: string }>(
  key: TKey,
  items: Array<TItem>,
) => {
  return items.reduce<
    Array<{
      label: string;
      items: Array<TItem>;
    }>
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
