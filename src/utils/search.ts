export const searchFromKeyword = <T>(items: Array<T>, parse: (item: T) => string, keyword: string): Array<T> => {
  return items.filter((item) => {
    const text = parse(item).toLowerCase();

    return keyword.toLowerCase().split(/\s/).every((word) => text.includes(word));
  })
}

export const getRecentViewTitle = (items: Array<unknown>, hasNextPage: boolean, unit: string) => {
  const unitString = items.length === 1 ? unit : `${unit}s`;

  if (!items.length) return `No recently viewed ${unitString} found`;

  return `${items.length} recently viewed ${unitString} ${hasNextPage ? 'loaded' : 'total'}`
}