import { Action, ActionPanel, Color, Icon } from "@raycast/api";

export type FilterKey = "createdUserId" | "assigneeId";

type Props = {
  filter: FilterKey;
  onFilterChange: (value: FilterKey) => void;
};

const FILTER_OPTIONS = [
  { label: "Assigned to me", value: "assigneeId" as const },
  { label: "Created by me", value: "createdUserId" as const },
];

export const MyIssuesActionPanel = ({ filter, onFilterChange }: Props) => {
  return (
    <ActionPanel.Submenu title="Filtered by ..." icon={Icon.Filter} shortcut={{ modifiers: ['cmd', 'shift'], key: 'f'}}>
      {FILTER_OPTIONS.map(({ label, value }, i) => (
        <Action
          key={value}
          title={label}
          icon={
            filter === value
              ? { source: Icon.CheckCircle, tintColor: Color.Green }
              : {
                  source: Icon.Circle,
                  tintColor: Color.SecondaryText,
                }
          }
          shortcut={{ modifiers: ["cmd"], key: i === 0 ? "1" : "2" }}
          onAction={() => onFilterChange(value)}
        />
      ))}
    </ActionPanel.Submenu>
  );
};
