# Tailwind CSS v4 @theme Token 命名规范

## 概述

`@theme` 中的 token 命名**有约定但很灵活**。Tailwind CSS v4 通过前缀来决定生成的工具类类型，但后缀部分可以自定义。

## 命名规则

### 1. 前缀决定工具类类型

```css
--color-brand-500    → bg-brand-500, text-brand-500, border-brand-500
--radius-md          → rounded-md
--shadow-lg          → shadow-lg
--font-sans          → font-sans
```

### 2. 常见的约定前缀

| 前缀          | 生成的工具类 | 示例                         |
| ------------- | ------------ | ---------------------------- |
| `--color-*`   | 颜色工具类   | `bg-*`, `text-*`, `border-*` |
| `--radius-*`  | 圆角工具类   | `rounded-*`                  |
| `--shadow-*`  | 阴影工具类   | `shadow-*`                   |
| `--font-*`    | 字体工具类   | `font-*`                     |
| `--spacing-*` | 间距工具类   | `p-*`, `m-*`, `gap-*`        |

### 3. 自定义命名示例

```css
@theme {
  /* ✅ 标准命名 */
  --color-brand-500: #4f7cff;

  /* ✅ 安全的自定义命名 */
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;

  /* ⚠️ 可用，但可能与 CSS 原生属性冲突 */
  --color-content-primary: #f8fafc;

  /* ❌ 避免使用 CSS 原生属性名 */
  --color-display: #fff;  /* display 是 CSS 属性 */
}
```

## 最佳实践

### ✅ 推荐做法

1. **遵循前缀约定**：使用 Tailwind 规定的前缀（`--color-`, `--radius-` 等）
2. **语义化命名**：使用描述性的后缀（`-primary`, `-secondary`, `-canvas`, `-panel`）
3. **避免冲突**：不使用 CSS 原生属性名作为后缀
4. **保持一致**：在整个项目中使用统一的命名模式

### ❌ 应该避免

1. **使用 CSS 原生属性名**：`content`, `display`, `position` 等
2. **过于简短的命名**：`--color-a`, `--color-b`（难以维护）
3. **不规范的前缀**：`--my-color-red`（应该使用 `--color-my-red`）

## 项目中的应用

### 当前配置示例

```css
@theme {
  /* 品牌色 - 标准命名 */
  --color-brand-50: #f3f7ff;
  --color-brand-500: #4f7cff;
  --color-brand-900: #111f4a;

  /* 表面色 - 自定义语义化命名 */
  --color-surface-canvas: #0a0f1e;
  --color-surface-panel: #111827;
  --color-surface-elevated: #172033;

  /* 文本色 - 推荐使用 text 而非 content */
  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;

  /* 边框色 */
  --color-border-default: rgba(255, 255, 255, 0.08);
  --color-border-strong: rgba(255, 255, 255, 0.14);

  /* 状态色 */
  --color-state-success: #22c55e;
  --color-state-error: #ef4444;
  --color-state-warning: #f59e0b;
}
```

### 使用示例

```tsx
// 品牌色
<div className="bg-brand-500 text-white">Primary Button</div>

// 表面色
<div className="bg-surface-panel border border-border-default">Card</div>

// 文本色
<h1 className="text-text-primary">标题</h1>
<p className="text-text-secondary">副标题</p>

// 状态色
<Badge className="bg-state-success">Success</Badge>
```

## 参考资源

- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Theme Configuration](https://tailwindcss.com/docs/theme)
