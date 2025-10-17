# KrishiAI - Comprehensive Design Guidelines

## Design Approach

**Selected Approach:** Design System with Agricultural Context
- **System Foundation:** Material Design with custom agricultural theming
- **Rationale:** Utility-focused platform requiring clear data visualization, accessible components, and consistent patterns for non-technical farmers
- **Key Principles:** Clarity over complexity, trust through familiarity, mobile-first accessibility

---

## Core Design Elements

### A. Color Palette

**Light Mode:**
- Primary (Agricultural Green): 142 71% 45% - represents growth and agriculture
- Background: 0 0% 100%
- Surface: 142 25% 96%
- Text Primary: 142 10% 15%
- Text Secondary: 142 8% 45%
- Success (Crop Health): 142 76% 36%
- Warning (Alert): 43 96% 56%
- Danger (Disease): 0 84% 60%

**Dark Mode:**
- Primary: 142 65% 55%
- Background: 142 15% 8%
- Surface: 142 12% 12%
- Text Primary: 142 10% 95%
- Text Secondary: 142 8% 65%

**Data Visualization Colors:**
- Chart Primary: 217 91% 60%
- Chart Secondary: 142 71% 45%
- Chart Accent: 271 91% 65%
- Chart Neutral: 240 5% 65%

### B. Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - UI elements, data, forms
- Display: 'Poppins' (Google Fonts) - headings, emphasis
- Monospace: 'JetBrains Mono' - data tables, metrics

**Hierarchy:**
- Hero Display: Poppins 600, 3.5rem (desktop) / 2rem (mobile)
- Page Headings: Poppins 600, 2rem / 1.5rem
- Section Headers: Poppins 500, 1.5rem / 1.25rem
- Body Text: Inter 400, 1rem
- Small Text: Inter 400, 0.875rem
- Data/Metrics: JetBrains Mono 500, 1.25rem

### C. Layout System

**Spacing Primitives:**
- Core units: 2, 4, 6, 8, 12, 16, 20 (Tailwind: p-2, p-4, p-6, p-8, p-12, p-16, p-20)
- Component padding: p-6 (mobile), p-8 (desktop)
- Section spacing: py-12 (mobile), py-20 (desktop)
- Card gaps: gap-6
- Grid gaps: gap-4 (mobile), gap-6 (desktop)

**Responsive Containers:**
- Max-width: max-w-7xl for main content
- Dashboard grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Form containers: max-w-md for single-column forms

### D. Component Library

**Navigation:**
- Top navbar with language selector prominent (globe icon + dropdown)
- Mobile: Bottom navigation bar for key features
- Breadcrumb navigation for deep pages
- Sticky header with elevation shadow on scroll

**Dashboard Cards:**
- Elevated cards with subtle shadows (shadow-md)
- Rounded corners (rounded-xl)
- Icon + Title + Metric + Trend indicator layout
- Micro-animations on hover (subtle scale transform)

**Forms & Input:**
- Material Design input fields with floating labels
- Location selector with state/district dropdowns
- Voice input button integrated in chat (microphone icon)
- Language selector as prominent toggle/dropdown
- Consistent focus states with primary color outline

**Data Visualization:**
- Line charts for crop growth trends
- Bar charts for yield comparisons
- Donut charts for budget allocation
- Real-time animated counters for key metrics
- Responsive charts scaling to container

**News Cards:**
- Card-based layout with thumbnail images
- State badge/tag showing region relevance
- Language indicator icon
- "Read more" + "Listen" (speaker icon) actions
- Expandable full article view with voice narration controls

**Disease Detection:**
- Large image upload zone with drag-drop
- Camera icon for mobile photo capture
- AI analysis loading state with progress indicator
- Results card with disease name, confidence %, treatment recommendations
- Before/after comparison view option

**AI Chat Interface:**
- Chat bubble design (farmer=left, AI=right)
- Voice waveform animation during speech input/output
- Language tag showing current conversation language
- Message timestamps
- Suggested quick actions as chips

### E. Animations & Interactions

**Page Transitions:**
- Subtle fade-in on route change (200ms)
- Dashboard cards stagger animate-in on load (100ms delay between)

**Micro-interactions:**
- Button press feedback (scale-95 on active)
- Loading states with spinner or skeleton screens
- Success/error toast notifications with slide-in animation
- Voice recording pulse animation
- Graph data point tooltips on hover

**Voice Features:**
- Microphone button with pulse ring when listening
- Speech waveform visualization during input
- Loading dots while AI processes
- Smooth text reveal when AI responds

### F. Accessibility & Localization

**Multilingual Support:**
- Language selector in top-right of navbar (flag icon + text)
- Font system supporting Devanagari, Tamil, Telugu, Kannada scripts
- RTL support consideration for future
- All UI labels, buttons, and content translate dynamically

**Voice Interface:**
- Clear microphone permissions prompt
- Visual feedback during voice input/output
- Fallback to text if voice fails
- Language-specific voice models indication

**Mobile Optimization:**
- Touch-friendly targets (minimum 44px)
- Bottom sheet modals for mobile forms
- Swipe gestures for news cards
- Offline mode indicators

### G. Images & Media

**Hero Section (Landing/Home):**
- Large hero image: Indian farmer in field with modern technology (tablet/phone), golden hour lighting
- Overlay gradient for text readability
- Call-to-action with blurred background buttons

**Dashboard:**
- No large hero - prioritize data and functionality
- Small illustrative icons for features (custom agricultural iconography)

**News Section:**
- Thumbnail images for news cards (crop photos, farmers, schemes)
- Full-width featured image in news detail view

**Disease Detection:**
- User-uploaded crop/plant images as primary visuals
- AI-generated result cards with treatment illustrations

**Authentication Pages:**
- Background: Subtle agricultural pattern or soft gradient
- Illustration: Simple farmer + technology icon pairing

---

## Page-Specific Guidelines

**Login/Signup:**
- Center-aligned form (max-w-md)
- Social login options if applicable
- Location selector integrated in signup flow
- Smooth slide transitions between login/signup

**Dashboard:**
- 3-column grid on desktop (metrics, graphs, news preview)
- Priority: Animated metric cards → Interactive graphs → Quick actions
- Floating action button for disease detection (bottom-right)

**News Page:**
- Masonry/card grid layout
- Filter chips for categories and states
- Infinite scroll or pagination
- Click → Modal/new page with full article + voice player

**Disease Detection:**
- Upload interface prominent (drag-drop zone)
- Camera icon for mobile capture
- Results display with confidence visualization
- Treatment recommendations in expandable sections

**AI Chat:**
- Full-height chat interface
- Input bar fixed at bottom
- Voice button integrated in input
- Language selector in chat header

---

## Technical Implementation Notes

- Use Framer Motion or React Spring for animations
- Chart.js or Recharts for data visualization
- Web Speech API for voice features
- Tailwind CSS for styling consistency
- Material-UI components as base (customized with theme)
- Progressive image loading for better performance