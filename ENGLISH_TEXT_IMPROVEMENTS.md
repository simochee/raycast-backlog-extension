# English Text Improvements Summary

This document summarizes the improvements made to English text throughout the Backlog Raycast extension codebase to make it more suitable for a tool.

## Key Changes Made

### 1. README.md
- **Title**: Changed "Quick access" to "Access" for more direct language
- **Features**: 
  - "View unread notification count" → "Display unread notification count"
  - "Quickly open recently viewed" → "Access recently viewed"
  - "Background process to keep unread counts up-to-date" → "Background sync to maintain up-to-date unread counts"
- **Installation**: Removed unnecessary periods, made steps more concise
- **Setup**: 
  - "Configuration" → "Setup"
  - Simplified language and improved clarity
  - "Press Save" → "Click Save"
- **API Key**: Added numbered steps for better clarity

### 2. package.json
- **Main description**: Added "directly from Raycast" for clarity
- **Commands**:
  - "Browse and manage" → "View and manage"
  - "Access recently viewed" → "Browse recently viewed"
  - "Display unread notification count" → "Show unread notification count"
  - "Background process to update" → "Background sync for"

### 3. Components

#### SpaceForm.tsx
- **Error message**: "Space not found" → "Unable to connect to Backlog space. Please verify your Space Key and API Key."
- **Dialog text**: "Delete Space" → "Remove Space" for consistency
- **Action buttons**: Dynamic text based on context ("Add Space" vs "Save Changes")
- **Placeholders**: Added helpful placeholder text for form fields

#### CommonActionPanel.tsx
- **Menu titles**: 
  - "Switch" → "Switch Space"
  - "Manage" → "Manage Spaces"
  - "Add Space" → "Add New Space"
- **Action organization**: Restructured "Help" submenu into "Tools" section
- **Action titles**: "Edit" prefix added to space management actions

#### IssueItem.tsx
- **Metadata labels**: 
  - "Subject" → "Summary"
  - "Issue Type" → "Type"
- **Default values**: Added "Unassigned" and "No due date" for better clarity
- **Action titles**: 
  - "Copy Issue Key and Subject" → "Copy Issue Key and Summary"
  - "Copy URL" → "Copy Issue URL"
  - "Toggle Detail" → "Toggle Details"

#### NotificationItem.tsx
- **Tooltips**: Added quotation marks around issue/project names for better readability
- **Action titles**: 
  - "Copy URL" → "Copy Issue URL"
  - "Copy Issue Key and Subject" → "Copy Issue Key and Summary"
- **Notification text**: 
  - "attached to issue" → "attached a file to issue"
  - "Invited to project" → "You were invited to project"
  - "Notified" → "Notification"
  - "notified you" → "sent you a notification"

#### ProjectItem.tsx
- **Action titles**: Added "View" or "Open" prefixes for consistency:
  - "Add Issue" → "Create Issue"
  - "Issues" → "View Issues"
  - "Board" → "View Board"
  - "Gantt Chart" → "View Gantt Chart"
  - "Documents" → "View Documents"
  - "Wiki" → "Open Wiki"
  - "Files" → "Browse Files"

#### WikiItem.tsx
- **Action titles**: Added explicit "Open in Browser" title and "Copy Wiki URL"

### 4. Main Views

#### recent-viewed.tsx
- **Dropdown**: 
  - "Recent Viewed Type" → "Filter by Type"
  - "Wikis" → "Wiki Pages"

#### unread-count.tsx
- **Status text**: "All read" → "No unread"
- **Subtitle format**: Removed parentheses for cleaner appearance
- **Bug fix**: Fixed typo "unraedCount" → "unreadCount"

## Principles Applied

1. **Consistency**: Standardized terminology throughout the codebase
2. **Clarity**: Made text more specific and actionable
3. **Conciseness**: Removed unnecessary words while maintaining meaning
4. **Professionalism**: Used appropriate language for a professional tool
5. **User Experience**: Improved tooltips and error messages for better usability
6. **Accessibility**: Added default values and placeholders for better guidance

## Impact

These improvements enhance the overall user experience by:
- Making the interface more intuitive
- Providing clearer feedback and guidance
- Ensuring consistent terminology across all components
- Improving accessibility with better default values and placeholders
- Making error messages more actionable
- Streamlining the language for better tool usability

All changes maintain the original functionality while significantly improving the English text quality throughout the extension.