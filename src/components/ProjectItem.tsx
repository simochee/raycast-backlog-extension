import { Action, Icon, List } from "@raycast/api"
import { Entity } from "backlog-js"
import { useCurrentSpace } from "../hooks/useCurrentSpace"
import { CommonActionPanel } from "./CommonActionPanel"

type Props = {
  project: Entity.Project.Project
}

export const ProjectItem = ({project}:Props) => {
  const currentSpace = useCurrentSpace();
  
  return (
    <List.Item
      title={project.name}
      subtitle={project.projectKey}
      icon={`https://${currentSpace.host}/api/v2/projects/${project.projectKey}/image?apiKey=${currentSpace.apiKey}`}
      actions={
        <CommonActionPanel>
          <Action.OpenInBrowser title="Open in Browser" url={`https://${currentSpace.host}/projects/${project.projectKey}`} />
          <Action.OpenInBrowser title="Add Issue" url={`https://${currentSpace.host}/add/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'n' }} icon={Icon.NewDocument} />
          <Action.OpenInBrowser title="Issues" url={`https://${currentSpace.host}/find/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'i' }} icon={Icon.Document}/>
          {project.chartEnabled && (
            <>
          <Action.OpenInBrowser title="Board" url={`https://${currentSpace.host}/board/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'b' }} icon={Icon.BarChart} />
          <Action.OpenInBrowser title="Gantt Chart" url={`https://${currentSpace.host}/gantt/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'c' }} icon={Icon.BarChart} />
            </>
          )}
          <Action.OpenInBrowser title="Documents" url={`https://${currentSpace.host}/document/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'd' }} icon={Icon.Book} />
          {project.useWiki && (
          <Action.OpenInBrowser title="Wiki" url={`https://${currentSpace.host}/wiki/${project.projectKey}/Home`} shortcut={{ modifiers: ['cmd'], key: 'v' }} icon={Icon.Book} />
          )}
          {project.useFileSharing && (
          <Action.OpenInBrowser title="Files" url={`https://${currentSpace.host}/file/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'f' }} icon={Icon.Folder} />
          )}
          {project.useSubversion && (

          <Action.OpenInBrowser title="Subversion" url={`https://${currentSpace.host}/subversion/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 's' }} icon={Icon.Code} />
          )}
          {project.useGit && (
          <Action.OpenInBrowser title="Git" url={`https://${currentSpace.host}/git/${project.projectKey}`} shortcut={{ modifiers: ['cmd'], key: 'g' }} icon={Icon.Code} />
          )}
        </CommonActionPanel>
      }
  />
  )
}