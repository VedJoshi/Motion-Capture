# Motion Capture Fitness - Style Guide

## Color Palette

### Primary Colors
- Primary: `#1a56db` - Main brand color
- Primary Light: `#3b82f6` - Used for hover states
- Primary Dark: `#1e429f` - Used for active states

### Secondary Colors
- Secondary: `#0ea5e9` - Used for complementary UI elements
- Secondary Light: `#38bdf8` - Used for hover states

### Accent Colors (Use Sparingly)
- Accent: `#f97316` - Used for call-to-action elements
- Accent Light: `#fdba74` - Used for hover states
- Accent Dark: `#c2410c` - Used for active states

### Functional Colors
- Success: `#059669` - Used for success states
- Warning: `#d97706` - Used for warning states
- Danger: `#dc2626` - Used for error states

### Neutral Colors
- White: `#ffffff` - Background for cards and components
- Neutral 50: `#f8fafc` - Page background
- Neutral 100-900: Various shades for text, borders, and other UI elements

## Typography

### Font Family
- Primary: 'Inter', sans-serif
- Code: 'Source Code Pro', monospace

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

### Font Weights
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

## Spacing System

- 0.25rem (4px)
- 0.5rem (8px)
- 0.75rem (12px)
- 1rem (16px)
- 1.25rem (20px)
- 1.5rem (24px)
- 2rem (32px)
- 2.5rem (40px)
- 3rem (48px)
- 4rem (64px)

## Shadows

- Shadow SM: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- Shadow MD: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)`
- Shadow LG: `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)`
- Shadow XL: `0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.04)`

## Border Radius

- SM: 0.25rem (4px)
- MD: 0.375rem (6px)
- LG: 0.5rem (8px)
- XL: 0.75rem (12px)
- Full: 9999px (Circular elements)

## Components

### Buttons

**Primary Button**
- Background: Primary Color
- Text: White
- Hover: Primary Dark
- Active/Pressed: Primary Dark + No Y-axis translation
- Disabled: 60% opacity

**Secondary Button**
- Background: White
- Text: Primary Color
- Border: Neutral 300
- Hover: Surface Light, Border: Primary Color
- Disabled: 60% opacity

**Accent Button** (Use sparingly)
- Background: Accent Color
- Text: White
- Hover: Accent Dark

### Cards

- Background: White
- Border: 1px solid Neutral 200
- Border Radius: Border Radius MD
- Shadow: Shadow SM
- Hover: Shadow MD
- Padding: 1.5rem

### Navigation

- Background: White
- Active: Primary Color background with White text
- Hover: Primary Light border
- Border Radius: Border Radius MD

### Status Indicators

- Success: Light green background with Success text color
- Warning: Light orange background with Warning text color
- Error: Light red background with Danger text color
- Info: Light blue background with Secondary text color

## Responsive Breakpoints

- XS: 480px and below
- SM: 640px and below
- MD: 768px and below
- LG: 1024px and below
- XL: 1280px and below
- 2XL: 1536px and below

## Animation

- Fast Transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
- Normal Transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
- Slow Transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
