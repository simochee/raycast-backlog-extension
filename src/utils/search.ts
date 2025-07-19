export const searchFromKeyword = <T>(items: T[], parse: (item: T) => string, keyword: string): T[] => {
  return items.filter((item) => {
    const text = parse(item).toLowerCase();

    return keyword.toLowerCase().split(/\s/).every((word) => text.includes(word));
  })
}