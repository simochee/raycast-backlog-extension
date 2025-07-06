# Backlog Raycast Extension

Quick access to your Backlog issues, projects and notifications directly from Raycast.

## Features

- ✅ View unread notification count in the menu bar
- 🔔 Browse and manage notifications
- 📄 Quickly open recently viewed issues, projects and wikis
- 🔄 Background process to keep unread counts up-to-date

## Installation

1. Open **Raycast** on your Mac.
2. Navigate to the **Store** tab and search for "Backlog".
3. Click **Install**.

## Configuration

After installation you need to provide your Backlog credentials:

1. Open Raycast Preferences (`⌘ ,`).
2. Go to **Extensions → Backlog**.
3. Enter your **Space ID** and **API Key**.

## Development

This repository contains the source code of the Raycast extension. Follow the steps below to run it locally.

### Prerequisites

- Node.js ≥ 20
- [pnpm](https://pnpm.io/) ≥ 8
- Raycast CLI (`npm i -g @raycast/api`)

### Setup

```bash
pnpm install
```

### Start in development mode

```bash
pnpm dev
```

Raycast will automatically reload the extension when you save files.

### Lint & format

```bash
pnpm lint         # check
pnpm fix-lint     # fix issues automatically
```

### Build for production

```bash
pnpm build
```

### Publish to the Raycast Store

Follow the guidelines in the [Raycast documentation](https://developers.raycast.com/basics/publishing-an-extension) and then run:

```bash
pnpm publish
```

## License

MIT