import { emojify } from "node-emoji";
import type { Entity } from "backlog-js";

type Options = {
  currentUser?: Entity.User.User;
};

export const formatMarkdown = (raw: string, { currentUser }: Options = {}) => {
  let markdown = raw;

  if (currentUser) {
    markdown = markdown.replaceAll(`@${currentUser.name}`, (matched) => `**${matched}**`);
  }

  markdown = emojify(markdown.replace(/\n/g, "  \n"));

  return markdown;
};
