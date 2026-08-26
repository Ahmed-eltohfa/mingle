---
name: Mingle
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464554'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#006591'
  on-secondary: '#ffffff'
  secondary-container: '#39b8fd'
  on-secondary-container: '#004666'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#c9e6ff'
  secondary-fixed-dim: '#89ceff'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#004c6e'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system focuses on a **Modern Corporate** aesthetic with a **Friendly** twist. It is designed to feel premium through generous whitespace and precise typography while remaining accessible via soft geometry and vibrant accents. 

The visual narrative avoids the clinical coldness of typical SaaS products by utilizing subtle background tints and rounded corners. The goal is to evoke a sense of community and fluidity, ensuring users feel both a professional level of reliability and a welcoming social atmosphere.

Key style drivers:
- **Soft Minimalism**: Reducing visual noise to highlight user-generated content.
- **Glassmorphism Lite**: Utilizing subtle blurs on fixed elements like navigation bars to maintain context.
- **Precision**: 1px borders and refined "Mingle Indigo" accents to provide a sense of high-quality craftsmanship.

## Colors
This design system uses a primary-focused palette supported by a "Deep Slate" neutral scale. 

- **Mingle Indigo (#6366f1)**: Used for primary actions, active states, and brand-heavy components.
- **Secondary Sky (#0ea5e9)**: Used sparingly for informative accents and secondary interactive elements to provide visual variety.
- **Surface Strategy**: 
    - In **Light Mode**, use `slate-50` (#f8fafc) for backgrounds and white for card surfaces.
    - In **Dark Mode**, use `slate-950` (#020617) for deep backgrounds and `slate-900` (#0f172a) for surfaces.
- **Borders**: Always use low-contrast borders (10% opacity black in light mode, 20% white in dark mode) to define sections without breaking the visual flow.

## Typography
The system relies exclusively on **Inter** for its systematic, utilitarian, and modern qualities. 

The hierarchy is built on a tight scale to ensure legibility across dense social feeds. 
- **Headlines**: Utilize tighter letter spacing and semi-bold weights to create a strong visual anchor.
- **Body Text**: Uses a standard 1.5x line height to maximize readability for long-form posts or comments.
- **Labels**: Slightly increased tracking (letter-spacing) on smaller labels (12px-14px) ensures clarity on high-density mobile screens.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a base-4 increment system. 

- **Desktop**: 12-column grid with a max-width of 1280px. Gutters are fixed at 24px to allow content to breathe.
- **Mobile**: 4-column grid with 16px side margins. 
- **Spacing Philosophy**: Components should generally use `16px` (md) for internal padding. Vertical stacking between distinct posts or feed items should use `24px` (lg) to prevent the UI from feeling cramped.

## Elevation & Depth
Depth is communicated through **Soft Shadows** and **Tonal Layers** rather than heavy contrast.

- **Level 0 (Background)**: Base surface color.
- **Level 1 (Cards)**: White (Light) or Slate-900 (Dark) with a 1px border. Use a subtle shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1)`.
- **Level 2 (Modals/Popovers)**: Elevated with a more pronounced, diffused shadow to draw immediate focus: `0 20px 25px -5px rgb(0 0 0 / 0.1)`.
- **Interactions**: On hover, cards should slightly lift (move -2px Y-axis) and the shadow should increase in diffusion.

## Shapes
The shape language is consistently **Rounded**, using a 16px (1rem) radius for major components to reinforce the friendly brand personality.

- **Default (rounded-md)**: 8px (0.5rem) for small inputs and buttons.
- **Large (rounded-lg)**: 16px (1rem) for containers and feed cards.
- **Full (rounded-full)**: Used for avatars, tags, and status indicators to create a distinctive "pill" look that contrasts with the structured grid.

## Components
- **Buttons**:
    - *Primary*: Solid Mingle Indigo background, white text. Hover state: Lighten background by 10%.
    - *Secondary*: Ghost style with 1px border and Indigo text.
- **Input Fields**:
    - 1px border (`slate-200`). On focus, apply a 2px outer ring of Mingle Indigo at 30% opacity and change the border color to the primary brand color.
- **Avatars**: Always circular (`rounded-full`). Include a 2px white border when overlapping or appearing on colored backgrounds.
- **Cards**: Use 16px padding and 16px corner radius. Borders are mandatory to maintain structure in dark mode.
- **Badges/Chips**: Pill-shaped with a light tint of the primary color (e.g., 10% Indigo background with 100% Indigo text).
- **Feed Interaction**: Like/Comment buttons should use "ghost" states that fill with color upon activation (e.g., heart turns solid red).