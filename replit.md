# Embodied OS - Biomarker-Driven Venue Discovery

## Overview
A React + Vite frontend application that analyzes biomarker data from PDFs and health reports, then recommends personalized venues using AI (bem.ai) and Google Maps. Includes a longevity tracking dashboard with Excel spreadsheet upload support and comprehensive metrics visualization.

## Project Architecture
- **Framework**: React 19 with Vite 7
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS v4 with custom animations
- **Charts**: Recharts 3.7 for data visualization
- **Build**: `npm run build` outputs to `dist/`
- **Dev server**: Vite on port 5000, host 0.0.0.0

### Key Directories
- `src/components/` - React components (Header, Navigation, DashboardView, SuggestionsView, MetricsView, UploadView, SpreadsheetView, GrowingPlant, LongevityScoreHero, CommunityMatchCard, MessagingPortal)
- `src/services/` - API clients (bemClient, biomarkerAnalyzer, pdfScanner)
- `src/utils/` - Utility functions (calculations, spreadsheetParser)
- `src/data/` - Default data and suggestion content (defaultSessionData, suggestions, communityData)
- `attached_assets/` - Photo assets (profile images, food photos, exercise photos) aliased as @assets in Vite
- `public/` - Static assets

### Integration Flow
1. PDF Upload → pdfScanner extracts text → bemClient analyzes with bem.ai → biomarkerAnalyzer maps to venue profile → Google Places search
2. Excel Upload → spreadsheetParser processes data → updates session tracking metrics → dashboard visualization

### Key Components
- **App.jsx** - Main app with state management for sessions, analysis, view routing, and messaging
- **UploadView** - Dual upload: PDF for AI analysis, Excel for session tracking
- **SuggestionsView** - AI recommendations + Google Maps venue discovery + photo assets + static wellness suggestions
- **DashboardView** - Session comparison charts, progress tracking, and community match card
- **CommunityMatchCard** - Wellness match with trajectory comparison chart and matched person photo
- **MessagingPortal** - Chat interface with matched user, trajectory mini-charts, and message images
- **MetricsView** - Detailed metrics with category breakdowns
- **LongevityScoreHero** - Animated score display with growing plant visualization

## Environment Variables
- `VITE_GOOGLE_PLACES_API` - Google Places API key (required)
- `VITE_BEM_API_KEY` - bem.ai API key (required)

## Deployment
- Static deployment serving the `dist/` directory
- Build step: `npm run build`

## User Preferences
- Warm color palette (amber, rose, orange gradients)
- Spectral serif for headings, Work Sans for body text
- Soft rounded cards with glassmorphism effects
- Google Maps JavaScript API used directly (not via wrapper)

## Recent Changes
- 2026-02-15: Added photo assets to suggestion cards (harvest bowl, purple potatoes) with aligned card layout
- 2026-02-15: Added user profile photo to Header and matched person photo (Maya) to CommunityMatchCard
- 2026-02-15: Created CommunityMatchCard with trajectory comparison chart and MessagingPortal for chat
- 2026-02-15: Single-line descriptions with line-clamp for consistent card heights
- 2026-02-15: Added @assets Vite alias for attached_assets directory
- 2026-02-15: Added mini Google Maps to each suggestion card showing venue location with marker
- 2026-02-15: Added "Discover Something New" shuffle button to randomize recommendations from Google Places results
- 2026-02-15: Removed "Save Spot" button per user request
- 2026-02-15: Extended Google Places to store up to 10 results per category for shuffle cycling
- 2026-02-15: Complete frontend overhaul with new component structure
- 2026-02-15: Added Tailwind CSS v4 with custom animations (fadeInUp, float)
- 2026-02-15: Integrated PDF upload with bem.ai analysis pipeline
- 2026-02-15: Added Excel upload for session tracking data
- 2026-02-15: Created longevity dashboard with recharts visualization
- 2026-02-15: Google Maps integration using native JS API
- 2026-02-15: Initial Replit setup - installed dependencies, configured workflow and deployment
