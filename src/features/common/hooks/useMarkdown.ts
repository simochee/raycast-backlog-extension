import { emojify } from "node-emoji";
import type { Issue, IssueComment } from "~common/transformers/issue";
import type { PullRequest, PullRequestComment } from "~common/transformers/pull-request";
import { useCurrentSpace } from "~space/hooks/useCurrentSpace";

export const useMarkdown = () => {
  const currentSpace = useCurrentSpace();

  const formatMarkdown = (issue: Issue | PullRequest, comment: IssueComment | PullRequestComment | undefined) => {
    let markdown = comment?.content || issue.description;

    for (const notification of comment?.notifications || []) {
      const userUrl = currentSpace.toUrl(`/user/${notification.user.userId}`);

      markdown = markdown.replaceAll(`@${notification.user.name}`, (matched) => `*[${matched}](${userUrl})*`);
    }

    markdown = markdown.replaceAll(/!\[(.*?)\]\[(.*?)\]/g, (matched, text, url) => {
      const attachment = issue.attachments.find(({ name }) => name === url);

      if (!attachment) return matched;

      let imageUrl =
        "repositoryId" in issue
          ? `/api/v2/projects/${issue.projectId}/git/repositories/${issue.repositoryId}/pullRequests/${issue.number}/attachments/${attachment.id}`
          : `/api/v2/issues/${issue.id}/attachments/${attachment.id}`;
      imageUrl += `?apiKey=${currentSpace.credential.apiKey}`;

      return `![${text}](${currentSpace.toUrl(imageUrl)})`;
    });

    markdown = markdown.replaceAll(/(.[A-Z0-9_]+-[0-9]+)/g, (_, $1) =>
      $1.startsWith("/") ? $1 : `[${$1}](${currentSpace.toUrl(`/view/${$1}`)})`,
    );

    markdown = emojify(markdown);
    markdown = markdown.replace(/\n/g, "  \n");

    return markdown;
  };

  return { formatMarkdown };
};
