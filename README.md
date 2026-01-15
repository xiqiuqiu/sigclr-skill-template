# Daily Work Tracker Skill

This skill provides an automated way to track your daily engineering work. It integrates seamlessly with your Git workflow to record time spent on tasks directly from your commit messages.

## Features

-   **Automatic Time Tracking**: Hooks into `git commit` to ask for time spent immediately after you finish a task.
-   **Smart Categorization**: Automatically detects if a task is a `BUG`, `FEATURE`, or `OTHER` based on your commit message (e.g., `fix:`, `feat:`).
-   **Daily Reports**: Generate a summary of what you did today or yesterday.
-   **JSON Storage**: Keeps a simple, local `data/work-log.json` file that you own.

## Installation

### 1. Agent Setup
Ensure this directory is placed within your Agent's skill directory (e.g., `.agent/skills/daily-work-tracker`).

### 2. Install Git Hook (Recommended)
To enable the automatic prompting after `git commit`, run the installation script:

```bash
node scripts/install-hook.cjs
```

This will create a `post-commit` hook in your `.git/hooks` directory.

## Usage

### Method 1: Automatic (Git Hook)
Just commit your code as usual in a terminal:

```bash
git commit -m "feat: implement user login"
```

The tracker will interrupt (after the commit) to ask:
> *How much time did you spend on this? (e.g., 30m, 1h)*

Enter the duration, and it's logged!

### Method 2: Manual Logging
You can manually log work using the script:

```bash
node scripts/log-work.cjs --type "FEATURE" --duration "1h" --description "Manual entry"
```

### Method 3: Generating Reports
To see what you did today:

```bash
node scripts/generate-report.cjs --date "today"
```

To see yesterday's work:
```bash
node scripts/generate-report.cjs --date "yesterday"
```

## Directory Structure

-   `scripts/`: Contains the logic for logging, reporting, and hooks.
    -   `log-work.cjs`: Core logging logic.
    -   `generate-report.cjs`: Reporting logic.
    -   `install-hook.cjs`: Setup script for Git integration.
    -   `post-commit-handler.cjs`: The interactive script triggered by Git.
-   `data/`: Stores your data.
    -   `work-log.json`: The database of your work items.
