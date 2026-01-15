# Daily Work Tracker Skill (每日工作追踪)

这是一个自动化的工作追踪 Skill，旨在帮助工程师记录每日工作内容。它能与您的 Git 工作流无缝集成，直接从提交信息（commit message）中记录任务耗时。

## 核心功能

-   **自动工时追踪**：挂载到 `git commit` 命令，在您提交代码后立即询问任务耗时。
-   **智能分类**：根据提交信息的格式（如 `fix:`, `feat:`）自动识别任务类型（BUG修复、新功能、其他）。
-   **日报生成**：一键生成今日或昨日的工作与工时汇总报告。
-   **本地数据存储**：所有数据保存在本地的 `data/work-log.json` 文件中，安全且易于管理。

## 安装指南

### 1. 环境准备
确保本目录位于 Agent 的 skill 目录下（例如 `.agent/skills/daily-work-tracker`）。

### 2. 安装 Git Hook（推荐）
为了启用提交后的自动交互功能，请运行以下安装脚本：

```bash
node scripts/install-hook.cjs
```

该脚本会在您的 `.git/hooks` 目录下创建一个 `post-commit` 钩子。

## 使用方法

### 方式一：自动化记录 (Git Hook)
在终端中像往常一样提交代码：

```bash
git commit -m "feat: 完成用户登录功能"
```

提交完成后，追踪器会立即提示：
> *How much time did you spend on this? (e.g., 30m, 1h)*
> *(您在这个任务上花费了多少时间？)*

输入时长（如 `1h` 或 `30m`），即可自动完成记录！

### 方式二：手动记录
您也可以使用脚本手动录入工作内容：

```bash
node scripts/log-work.cjs --type "FEATURE" --duration "1h" --description "手动录入的记录"
```

### 方式三：生成日报
查看今天的工作内容：

```bash
node scripts/generate-report.cjs --date "today"
```

查看昨天的内容：
```bash
node scripts/generate-report.cjs --date "yesterday"
```

## 目录结构说明

-   `scripts/`: 包含核心逻辑、报告生成及 Hook 脚本。
    -   `log-work.cjs`: 负责写入日志的核心逻辑。
    -   `generate-report.cjs`: 负责生成统计报告。
    -   `install-hook.cjs`: 用于安装 Git Hook 的脚本。
    -   `post-commit-handler.cjs`: 被 Git 触发的交互式脚本。
-   `data/`: 存放数据。
    -   `work-log.json`: 存储所有工作记录的数据库文件。
