# Embodied OS - Biomarker-Driven Venue Discovery

## Overview
A React + Vite frontend application that analyzes biomarker data from PDFs and health reports, then recommends personalized venues using AI (bem.ai) and Google Maps.

## Project Architecture
- **Framework**: React 19 with Vite 7
- **Language**: JavaScript (JSX)
- **Build**: `npm run build` outputs to `dist/`
- **Dev server**: Vite on port 5000, host 0.0.0.0

### Key Directories
- `src/components/` - React components (e.g., SuggestionsView)
- `src/services/` - API clients (bemClient, biomarkerAnalyzer, pdfScanner)
- `src/utils/` - Utility functions
- `public/` - Static assets

## Environment Variables
- `VITE_GOOGLE_PLACES_API` - Google Places API key (required)
- `VITE_BEM_API_KEY` - bem.ai API key (required)

## Deployment
- Static deployment serving the `dist/` directory
- Build step: `npm run build`

## Recent Changes
- 2026-02-15: Initial Replit setup - installed dependencies, configured workflow and deployment
