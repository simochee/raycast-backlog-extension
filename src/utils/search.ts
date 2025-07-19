export const searchFromKeyword = <T>(items: T[], parse: (item: T) => string, keyword: string): T[] => {
  return items.filter((item) => {
    const text = parse(item).toLowerCase();

    return keyword.toLowerCase().split(/\s/).every((word) => text.includes(word));
  })
}

export const getRecentViewTitle = (items: unknown[], hasNextPage: boolean, unit: string) => {
  const unitString = items.length === 1 ? unit : `${unit}s`;

  if (!items.length) return `No recently viewed ${unitString}`;

  return `${items.length} recently viewed ${unitString} ${hasNextPage ? 'loaded' : 'total'}`
}