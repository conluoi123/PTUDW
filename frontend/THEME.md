# Theme System Documentation

## Overview

Ứng dụng sử dụng một hệ thống theme tập trung dựa trên **CSS Variables** và **React Context** để quản lý màu sắc và dark/light mode.

## Kiến trúc

### 1. CSS Variables (`src/index.css`)

Tất cả màu sắc được định nghĩa trong CSS variables:

```css
:root {
  /* Light Mode */
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.20 0 0);
  --primary: oklch(0.58 0.24 320);
  /* ... */
}

.dark {
  /* Dark Mode */
  --background: oklch(0.12 0 0);
  --foreground: oklch(0.98 0 0);
  --primary: oklch(0.75 0.20 320);
  /* ... */
}
```

### 2. Theme Context (`src/contexts/ThemeContext.jsx`)

Quản lý dark/light mode và cung cấp theme configuration:

```javascript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  
  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
}
```

### 3. Theme Constants (`src/constants/theme.js`)

Định nghĩa các Tailwind classes tái sử dụng:

```javascript
import { COLORS, BUTTON_VARIANTS, STATUS_COLORS } from '@/constants/theme';

function MyComponent() {
  return (
    <div className={COLORS.card}>
      <button className={BUTTON_VARIANTS.primary}>
        Click me
      </button>
      <span className={STATUS_COLORS.success}>
        Success!
      </span>
    </div>
  );
}
```

## Cách sử dụng

### ✅ ĐÚNG - Sử dụng Tailwind utility classes

```javascript
// Sử dụng theme colors
<div className="bg-card text-card-foreground">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// Sử dụng constants
import { COLORS } from '@/constants/theme';
<div className={COLORS.card}>...</div>
```

### ❌ SAI - Hard-code màu

```javascript
// KHÔNG làm thế này!
<div className="bg-white dark:bg-gray-900">
<div className="bg-gray-800 text-white">
<div style={{ backgroundColor: '#1a1a1a' }}>
```

## Danh sách Tailwind Classes

### Background Colors
- `bg-background` - Màu nền chính
- `bg-card` - Màu nền card/container
- `bg-popover` - Màu nền popover/dropdown
- `bg-primary` - Màu primary (purple/pink)
- `bg-secondary` - Màu secondary
- `bg-accent` - Màu accent (hover states)
- `bg-muted` - Màu muted (disabled states)
- `bg-input` - Màu nền input fields

### Text Colors
- `text-foreground` - Màu chữ chính
- `text-card-foreground` - Màu chữ trên card
- `text-primary-foreground` - Màu chữ trên primary background
- `text-muted-foreground` - Màu chữ muted

### Borders
- `border-border` - Màu border chuẩn
- `border-input` - Màu border cho input

## Thay đổi Theme

### Đổi màu toàn bộ app

Chỉ cần sửa trong `src/index.css`:

```css
:root {
  /* Đổi primary color sang xanh lá */
  --primary: oklch(0.60 0.20 140);
}
```

### Thêm màu mới

1. Thêm vào `src/index.css`:
```css
:root {
  --custom: oklch(0.70 0.15 200);
  --custom-foreground: oklch(1 0 0);
}
```

2. Thêm vào Tailwind config (nếu cần):
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      custom: 'var(--custom)',
    }
  }
}
```

3. Sử dụng:
```javascript
<div className="bg-custom text-custom-foreground">
```

## Best Practices

1. **Luôn dùng CSS variables** thông qua Tailwind classes
2. **Không hard-code màu** trong components
3. **Sử dụng constants** từ `theme.js` cho các patterns lặp lại
4. **Test cả light và dark mode** khi thêm UI mới
5. **Sử dụng `useTheme` hook** khi cần access theme programmatically

## Ví dụ Component

```javascript
import { useTheme } from '@/contexts/ThemeContext';
import { COLORS, BUTTON_VARIANTS } from '@/constants/theme';

function MyCard() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`${COLORS.card} p-6 rounded-lg border border-border`}>
      <h2 className="text-foreground font-bold mb-4">
        Card Title
      </h2>
      <p className="text-muted-foreground mb-4">
        Card description
      </p>
      <button className={BUTTON_VARIANTS.primary}>
        Action
      </button>
    </div>
  );
}
```

## Troubleshooting

### Màu không thay đổi khi toggle dark mode?
- Kiểm tra xem component có dùng hard-coded colors không
- Đảm bảo đang dùng Tailwind classes (`bg-card`) thay vì CSS trực tiếp

### Màu trông khác giữa light và dark mode?
- Kiểm tra CSS variables trong `index.css`
- Đảm bảo cả `:root` và `.dark` đều có định nghĩa màu

### Component không access được theme?
- Đảm bảo component nằm trong `<ThemeProvider>`
- Import và sử dụng `useTheme()` hook
