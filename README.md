<img src="./assets/icon-brand.png" alt="Backlog" width="64" height="64">

# Backlog

[![English edition](https://img.shields.io/badge/README-English-blue)](/README.md)
[![日本語版](https://img.shields.io/badge/README-日本語-blue)](/README.ja.md)
[![Install from Backlog Store](https://img.shields.io/badge/Raycast_Store-Backlog-ff6363?logo=raycast)](https://www.raycast.com/simochee/backlog)

> Access your [Backlog](https://backlog.com) issues, projects, and notifications directly from Raycast.

## Main Features

- Display unread notification count in menu bar
- Browse notifications sent to you
- Access recently viewed issues, projects, and wikis
- Support for multiple spaces

## Installation

1. Open **Raycast** on your Mac
2. Navigate to **Store** and search for "Backlog"
3. Click **Install**

## Initial Setup

On first use, you'll need to register your Backlog space and API key:

1. Run any Backlog command (e.g., "Notifications")
2. Enter your **Space Domain** (domain ending with `.backlog.com` or `.backlog.jp`) and **API Key**
3. Click **Save** or press Command + Enter to register your space

### About API Keys

You can obtain your space's API key by following these steps:

1. Go to **Personal Settings → API** from the user icon in the global bar[^1]
2. In **API Settings**, click **Generate new API Key** and enter a memo like "Backlog Raycast Extension" and click "Register"
3. Copy the API key displayed in **Registered API Keys**

[^1]: A link to the API page will be displayed when you enter your space domain in the space registration screen

## Shortcuts

- `Enter`: Open in browser
- `Cmd + Shift + u`: Copy URL
- `Cmd + Shift + f`: Toggle detail panel

### Issues

- `Cmd + c`: Copy issue key only
- `Cmd + Shift + c`: Copy issue key and title

### Projects

- `Cmd + Enter`: Open project menu

### Others

- `Cmd + Shift + r`: Clear fetched data cache (please reopen the command)
- `Cmd + Shift + m`: Manage registered spaces
- `Cmd + Shift + n`: Register another space

## Development

1. Clone this repository
1. Install dependencies with `pnpm install` (or `npx nypm install`)
1. Start the extension in Development Mode with `pnpm run dev` (or `npx nypm run dev`)
1. Press `Cmd + E` to open the extension in Raycast
