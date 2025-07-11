import { emojify } from "node-emoji";

export const formatMarkdown = (markdown: string) => {
  return emojify(markdown.replace(/\n/g, "  \n"));
};
