# BrandSide — Android app (React Native + Expo)

Built from the Figma file "brand-side": the **mobile** frames (logged-out site, dashboard, popups/sheets/toasts).
Data is demo data in `src/data.ts`. Rename the product in `src/theme.ts` (`BRAND`).

## Run locally
1. Install a Node.js version supported by Expo SDK 58 (22.13+ on the 22.x line or 24.3+ on the 24.x line; https://nodejs.org).
2. On your Android phone install **Expo Go** from the Play Store. This project targets Expo SDK 58, so Expo Go must support SDK 58.
3. In this folder:
   ```
   npm install
   npx expo install --check
   npx expo start
   ```
4. Scan the QR code with Expo Go (phone + computer on the same Wi-Fi).
   - Different networks / firewall: `npx expo start --tunnel`
   - Android emulator instead: `npx expo start --android`

`expo install --check` verifies that native package versions match this project's Expo SDK; it does not upgrade the project to match a different Expo Go release.

## Try these flows
- Welcome -> Sign Up or Log In -> choose Brand, Creator, or Admin
- Brand -> sign up / log in -> onboarding or Dashboard
- Creator and Admin -> see that those experiences are still in progress
- Logged-out creator profile -> Log In -> choose Brand -> returns to that creator
- Jobs -> Post a job / Review bids -> Select (hires + escrow)
- Orders -> open an order -> Approve & pay
- More -> Lists, Deliverables, Reporting, Messages, Upgrade/Help toasts

## Structure
- `src/theme.ts` colours/fonts from Figma - `src/data.ts` demo data - `src/store.tsx` app state
- `src/components/ui.tsx` shared components - `src/navigation.tsx` tabs + stack
- `src/screens/` Public (landing/auth/onboarding), Dashboard (tabs), Workspace, Sheets (popups)

## Known gaps
- Creator photos are Figma demo images; placeholders (gradient + initials) are used until real image URLs exist.
- Creator profile layout is inferred (that screen was removed from the Figma file).
