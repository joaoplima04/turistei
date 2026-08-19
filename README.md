# Turistei

**Turistei** is a full-stack travel-planning application focused on helping users discover attractions, define travel preferences, receive recommendations, organize itineraries, and explore places through interactive maps.

This repository contains the **Next.js frontend**. The companion Python/FastAPI backend is available at [`joaoplima04/TuristeiAPI`](https://github.com/joaoplima04/TuristeiAPI).

## Tech stack

- **Next.js 14**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Leaflet / React Leaflet** for map experiences
- **Radix UI** primitives
- **Lucide React** icons

## Product flows

The application includes user-facing and administrative workflows such as:

- User registration and login
- User profile management
- Travel preference capture
- Attraction recommendations
- Interactive maps
- Itinerary creation and route visualization
- Attraction submission requests
- Administrative screens for platform management

The frontend is organized with the Next.js App Router under `src/app`, with reusable UI elements kept under `src/components`.

## Project structure

```text
src/
├── app/
│   ├── admin/                  # Administrative flows
│   ├── cadastro/               # Registration
│   ├── login/                  # Login
│   ├── perfil/                 # User profile
│   ├── preferencias/           # Travel preferences
│   ├── recomendacoes/          # Recommendations
│   ├── mapa/                   # Map experience
│   ├── mapa-recomendacoes/     # Recommendation map
│   ├── mapa-roteiro/           # Itinerary map
│   ├── cadastra_roteiros/      # Itinerary creation
│   └── solicitar-atracao/      # New-attraction request flow
├── components/                 # Reusable UI components
└── lib/                        # Shared utilities
```

## Running locally

### 1. Clone the repository

```bash
git clone https://github.com/joaoplima04/turistei.git
cd turistei
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Backend integration

Turistei is designed to work with the FastAPI service in the companion [`TuristeiAPI`](https://github.com/joaoplima04/TuristeiAPI) repository. The backend owns the relational data model and API domains for users, places, preferences, recommendations, schedules, and attraction requests.

Keeping the frontend and backend separated makes the API boundary explicit and allows each side to evolve independently.

## Engineering focus

This project demonstrates practical full-stack product development across:

- Typed React/Next.js interfaces
- API-driven application flows
- Client/server separation
- Interactive map integration
- Reusable component architecture
- User and administrative workflows

## Author

**João Lucas**  
Full-stack software engineer focused on TypeScript/Next.js, Python/FastAPI, PostgreSQL, API integrations, cloud infrastructure, and secure software development.

- GitHub: [@joaoplima04](https://github.com/joaoplima04)
