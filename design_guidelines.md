# Design Guidelines: Team & Events Single-Page Application

## Design Approach
**System-Based Approach**: Utility-focused application using modern web design principles with clean, minimalist aesthetics. Drawing inspiration from productivity tools like Linear and Notion for their clarity and restraint.

## Core Design Elements

### Typography
- **Headings**: Large, bold sans-serif (text-3xl to text-5xl, font-bold)
- **Section Titles**: Medium weight (text-2xl, font-semibold)
- **Body Text**: Regular weight (text-base to text-lg)
- **Labels/Metadata**: Smaller, subtle text (text-sm, text-gray-600)

### Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, and 16 consistently
- Section padding: py-16 to py-20
- Card/component spacing: p-6 to p-8
- Grid gaps: gap-6 to gap-8
- Container: max-w-6xl mx-auto

**Layout Structure**:
- Centered, single-column layout with consistent max-width container
- Full-width soft gradient background
- All sections stack vertically with generous breathing room

### Component Specifications

**Header/Logo Section**:
- Centered logo placement
- Moderate height (py-12 to py-16)
- Prominent but not overwhelming
- Use text-based logo or simple placeholder image (150-200px width)

**Team Section**:
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Team member cards with:
  - Avatar placeholder or initials circle (w-20 h-20, rounded-full)
  - Name (text-xl, font-semibold)
  - Role (text-sm, uppercase, tracking-wide, muted color)
  - Short bio (text-sm to text-base, 2-3 lines)
- Cards: white/light background, rounded-xl, subtle shadow (shadow-sm to shadow-md), padding p-6

**Event Calendar Section**:
- Clean list-based layout (not traditional calendar grid)
- Each event card:
  - Date badge/pill on left (rounded, subtle background)
  - Event title (text-lg, font-medium)
  - Horizontal layout for date + title
  - Optional time/location metadata below
- Stack events with space-y-4
- Maximum 4-6 visible events

**Contact Section**:
- Three-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Each contact item:
  - Icon above text (w-6 h-6)
  - Label (text-sm, font-medium)
  - Value (text-base)
- Center-aligned text within each column

**Links Section**:
- Horizontal icon row, centered
- Platform icons: w-10 h-10 to w-12 h-12
- Even spacing between icons (gap-6)
- Include: Twitch, YouTube, Twitter, Instagram, Discord (if applicable)
- Subtle hover effect on icons (scale or opacity change)

### Visual Treatment

**Background**:
- Soft gradient from top to bottom
- Suggested gradients: 
  - Cool: from-blue-50 via-purple-50 to-pink-50
  - Warm: from-orange-50 via-rose-50 to-pink-50
  - Neutral: from-gray-50 to-gray-100
- Very subtle, should not compete with content

**Cards & Containers**:
- Background: white or very light (bg-white/bg-gray-50)
- Rounded corners: rounded-lg to rounded-xl
- Shadow: shadow-sm to shadow-md
- Border: optional subtle border (border border-gray-200)

**Icons**:
Use **Heroicons** via CDN for all UI icons (contact, calendar, etc.)
Use **Font Awesome** or platform-specific icons for social media links

### Spacing & Rhythm
- Consistent vertical rhythm between sections: space-y-16 to space-y-20
- Internal component spacing: space-y-4 to space-y-6
- Card grid gaps: gap-6 to gap-8
- Generous padding within cards maintains breathing room

### Responsive Behavior
- Mobile: Single column, full-width cards, reduced padding
- Tablet: Two-column grids where applicable
- Desktop: Three-column grids, maximum container width
- All text remains readable at all breakpoints

### Key Principles
- **Minimalism**: Clean, uncluttered design
- **Consistency**: Uniform spacing, shadows, and rounding throughout
- **Readability**: High contrast text, generous line height
- **Hierarchy**: Clear visual distinction between section titles, headings, and body text
- **Restraint**: No unnecessary animations or decorative elements

## Images
No hero images required. Use placeholder avatars/initials for team members. All other visuals come from icons and gradient background.