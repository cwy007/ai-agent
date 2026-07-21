# AGENTS.md

## Communication

- 始终使用中文回复，除非用户明确要求其他语言。
- 先做最小范围定位，再修改，再立即做针对性的验证；不要先大范围扫仓库。
- 优先直接执行可验证的改动，不要只给方案。

## Workspace Overview

- 这是一个 pnpm workspace + Turborepo monorepo。
- 应用位于 `apps/`：`web` 是 Next.js 前台，`admin` 是 Next.js 后台，`api` 是 Cloudflare Workers + Hono。
- 共享包位于 `packages/`：`@repo/ui` 提供 UI 原子组件与主题，`@repo/contracts` 提供 API 合约与 schema，`@repo/eslint-config` 和 `@repo/typescript-config` 提供共享配置。

## Commands

- 根目录常用命令：`pnpm dev`、`pnpm build`、`pnpm lint`、`pnpm check-types`。
- 定位单个项目时优先用 filter：`pnpm --filter web dev`、`pnpm --filter admin dev`、`pnpm --filter @repo/api check-types`。
- `web` 默认端口是 `3005`，`admin` 默认端口是 `3006`。
- 修改 Cloudflare Worker 绑定后，运行 `pnpm --filter @repo/api cf-typegen`。

## Conventions

- 共享依赖版本统一维护在 [pnpm-workspace.yaml](./pnpm-workspace.yaml) 的 `catalog` 中；公共依赖在各包的 `package.json` 里应使用 `catalog:`，不要重复写版本号。
- 新增或调整 workspace 包时，同时检查对应包的 `package.json` `exports` 是否覆盖实际导入方式；如果会使用包根导入，必须显式导出 `"."`。
- `@repo/ui` 目前以子路径形式消费组件，例如 `@repo/ui/button`、`@repo/ui/card`；主题入口是 `@repo/ui/theme.css`。
- `apps/api` 运行在 Worker 环境，不要默认按 Node.js 运行时假设处理全局对象和类型。

## Validation

- 改动后优先跑最小验证，不要默认跑全仓。
- Next 应用优先运行对应 app 的 `check-types` 或 `lint`。
- API 改动优先运行 `pnpm --filter @repo/api check-types`。
- 包导出、路径别名、类型声明相关问题，先检查消费方依赖声明，再检查被消费包的 `exports` 和 tsconfig。

## Docs

- 设计令牌与 Tailwind v4 token 命名约定见 [docs/tailwind-theme-tokens.md](./docs/tailwind-theme-tokens.md)。
- API 的 Worker 类型生成说明见 [apps/api/README.md](./apps/api/README.md)。

## Current Pitfalls

- 仓库 README 仍保留部分 Turborepo 模板内容，涉及实际命令和端口时以各 app/package 的 `package.json` 为准。
- `@repo/contracts` 这类 workspace 包如果只导出子路径，编辑器会对包根导入报 `Cannot find module`；遇到同类问题先查 `exports`。
- API 的 TypeScript 配置需要 Worker 相关 lib 才能识别 `crypto`、`console` 等运行时全局。