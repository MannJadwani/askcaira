# Ask Caira - Design System
## Glassmorphic Data Analytics Interface

This document defines the visual design language for Ask Caira, inspired by modern glassmorphism and high-tech data interfaces.

---

## 🎨 Core Design Philosophy

**"Sophisticated Data Through Glass"**

Ask Caira embodies a futuristic, professional aesthetic that makes complex data feel accessible and beautiful. The interface should feel like you're operating a high-tech analytical system through elegant frosted glass panels.

---

## 🌟 Primary Style: Glassmorphism

### Glass Effect Properties
```css
/* Main glassmorphic container */
.glass-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Secondary glass elements */
.glass-secondary {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}
```

### Key Characteristics
- **Transparency**: 3-8% white overlay on dark backgrounds
- **Blur**: 15-20px backdrop filter for depth
- **Borders**: Subtle 1px borders with 8-12% white opacity
- **Rounded Corners**: 12-20px border radius for modern feel
- **Shadows**: Deep, soft shadows for floating effect

---

## 🎭 Color Palette

### Background Colors
```css
:root {
  /* Primary Backgrounds */
  --bg-primary: #0a0a0f;        /* Deep space black */
  --bg-secondary: #111125;      /* Dark navy */
  --bg-tertiary: #1a1a2e;       /* Lighter navy */
  
  /* Gradient Backgrounds */
  --bg-gradient-main: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  --bg-gradient-card: linear-gradient(145deg, rgba(26, 26, 46, 0.4) 0%, rgba(10, 10, 15, 0.6) 100%);
}
```

### Accent Colors
```css
:root {
  /* Neon Blue (Primary) */
  --accent-blue: #00d4ff;
  --accent-blue-glow: rgba(0, 212, 255, 0.4);
  --accent-blue-dim: rgba(0, 212, 255, 0.1);
  
  /* Neon Purple (Secondary) */
  --accent-purple: #a855f7;
  --accent-purple-glow: rgba(168, 85, 247, 0.4);
  
  /* Neon Green (Success) */
  --accent-green: #10d9c4;
  --accent-green-glow: rgba(16, 217, 196, 0.4);
  
  /* Warning/Orange */
  --accent-orange: #ff6b35;
  --accent-orange-glow: rgba(255, 107, 53, 0.4);
}
```

### Text Colors
```css
:root {
  --text-primary: #ffffff;      /* Pure white for headings */
  --text-secondary: #e2e8f0;    /* Light gray for body text */
  --text-tertiary: #94a3b8;     /* Medium gray for captions */
  --text-accent: #00d4ff;       /* Neon blue for links/highlights */
}
```

---

## 📊 Data Visualization Colors

### Chart Color Palette
```css
:root {
  /* Primary Chart Colors */
  --chart-blue: #00d4ff;
  --chart-purple: #a855f7;
  --chart-green: #10d9c4;
  --chart-orange: #ff6b35;
  --chart-pink: #ec4899;
  --chart-yellow: #fbbf24;
  
  /* Gradient Variations */
  --chart-gradient-1: linear-gradient(135deg, #00d4ff 0%, #a855f7 100%);
  --chart-gradient-2: linear-gradient(135deg, #10d9c4 0%, #00d4ff 100%);
  --chart-gradient-3: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
}
```

---

## 🔤 Typography

### Font Family
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
}
```

### Typography Scale
```css
:root {
  /* Headings */
  --text-6xl: 3.75rem;    /* 60px - Hero titles */
  --text-5xl: 3rem;       /* 48px - Page titles */
  --text-4xl: 2.25rem;    /* 36px - Section headers */
  --text-3xl: 1.875rem;   /* 30px - Card titles */
  --text-2xl: 1.5rem;     /* 24px - Subheadings */
  --text-xl: 1.25rem;     /* 20px - Large text */
  
  /* Body Text */
  --text-base: 1rem;      /* 16px - Body text */
  --text-sm: 0.875rem;    /* 14px - Small text */
  --text-xs: 0.75rem;     /* 12px - Captions */
}
```

### Font Weights
- **Light (300)**: Large display text, elegant headings
- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Emphasis, button text
- **Semibold (600)**: Card titles, important labels
- **Bold (700)**: Main headings, CTAs

---

## 🎛️ Component Styles

### Cards & Containers
```css
/* Primary Glass Card */
.card-primary {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Chart Container */
.chart-container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
}
```

### Buttons
```css
/* Primary CTA Button */
.btn-primary {
  background: linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%);
  color: #0a0a0f;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
}

/* Secondary Glass Button */
.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 500;
}
```

### Inputs & Forms
```css
.input-glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 16px;
}

.input-glass:focus {
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  outline: none;
}
```

---

## 📱 Layout Patterns

### Dashboard Grid
```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}

/* Split View (Visualization + Chat) */
.split-view {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  height: calc(100vh - 120px);
}
```

### Navigation
```css
.nav-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 24px;
}
```

---

## ✨ Effects & Animations

### Glow Effects
```css
.glow-blue {
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
}

.glow-purple {
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
}

/* Hover Glow Animation */
.glow-hover:hover {
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.5);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

### Fade In Animations
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}
```

---

## 📊 Data Visualization Guidelines

### Chart Styling
- **Background**: Transparent or subtle glass effect
- **Grid Lines**: rgba(255, 255, 255, 0.1)
- **Data Points**: Bright accent colors with glow effects
- **Hover States**: Increase glow and add subtle scale
- **Tooltips**: Glass-morphic with blur and border

### Progress Indicators
```css
.progress-ring {
  background: conic-gradient(
    from 0deg,
    #00d4ff 0%,
    #a855f7 100%
  );
  border-radius: 50%;
  position: relative;
}

.progress-ring::before {
  content: '';
  position: absolute;
  inset: 8px;
  background: var(--bg-primary);
  border-radius: 50%;
}
```

---

## 🎯 Page-Specific Guidelines

### Landing Page
- **Hero Section**: Large glassmorphic panel with gradient text
- **Features**: Glass cards with glowing icons
- **CTA**: Prominent neon blue gradient button

### Dashboard
- **File Cards**: Glass containers with data previews
- **Stats**: Circular progress indicators with neon colors
- **Upload Zone**: Dashed border with hover glow effect

### Visualization Page
- **Split Layout**: 2/3 charts, 1/3 chat
- **Chart Controls**: Glass sidebar with filter options
- **Chat Interface**: Bubble design with glass effect

### Chat Interface
- **User Messages**: Right-aligned glass bubbles
- **AI Messages**: Left-aligned with blue accent border
- **Input**: Full-width glass input with glow on focus

---

## 🔧 Implementation Notes

### Tailwind CSS Classes
Create custom classes for the glass effects:
```css
.glass-primary { @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl; }
.glass-secondary { @apply bg-white/3 backdrop-blur-lg border border-white/8 rounded-xl; }
.text-glow { @apply drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]; }
.neon-border { @apply border border-blue-400/50 shadow-[0_0_20px_rgba(0,212,255,0.3)]; }
```

### Browser Support
- **Webkit**: Use `-webkit-backdrop-filter` fallback
- **Firefox**: Consider alternative blur effects
- **Mobile**: Reduce blur intensity for performance

### Performance
- Limit backdrop-filter usage on mobile
- Use transform3d for hardware acceleration
- Optimize glassmorphic elements for 60fps

---

## 🎨 Brand Elements

### Logo Treatment
- Clean, geometric wordmark
- Optional neon glow effect
- Monochrome on glass backgrounds

### Iconography
- Line-based icons (Lucide or Heroicons)
- 1-2px stroke width
- Rounded line caps
- Subtle glow on interactive states

### Loading States
- Skeleton screens with glass effect
- Pulsing animations
- Neon progress bars

---

This design system creates a cohesive, premium feel that positions Ask Caira as a sophisticated, cutting-edge data analysis tool. The glassmorphic aesthetic combined with thoughtful use of neon accents creates an interface that's both beautiful and highly functional. 