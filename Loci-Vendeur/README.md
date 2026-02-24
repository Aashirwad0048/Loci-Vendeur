# Loci-Vendeur (Frontend)

Loci-Vendeur is a React + Vite frontend for a wholesale/vendor platform. This README focuses on the frontend setup and how it connects to the backend API.

## Tech Stack

- React (Vite)
- React Router
- Axios
- Tailwind CSS

## Project Structure

```
Loci-Vendeur/
  public/
  src/
    api/
      axios.js
    components/
    pages/
    context/
    mock-data/
    wholesale-pages/
  index.html
  vite.config.js
```

## Requirements

- Node.js 18+ (recommended)
- npm 9+

## Setup (Local Development)

1) Install dependencies

```bash
npm install
```

2) Create a `.env` file in this folder (same level as `package.json`)

```bash
VITE_API_URL=http://localhost:5000/api
```

3) Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## API Client Configuration

The Axios client lives in [src/api/axios.js](src/api/axios.js). It uses a base URL and attaches a Bearer token if present. For local dev, keep `VITE_API_URL` pointing to your local backend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

Frontend uses Vite env variables. Prefix with `VITE_`.

- `VITE_API_URL` - Base URL for the backend API (example: `https://api.example.com/api`)

## Deployment (Frontend)

### Vercel

1) Import the repo into Vercel.
2) Set **Root Directory** to `Loci-Vendeur`.
3) Build Command: `npm run build`.
4) Output Directory: `dist`.
5) Add env var: `VITE_API_URL=https://your-backend-domain/api`.
6) Deploy.

## Backend Repository

The backend lives in a sibling folder: `Loci-Vendeur_Backend`. Deploy it separately and point `VITE_API_URL` to its public URL.

## Troubleshooting

- **CORS errors**: Ensure backend allows the frontend domain and credentials if needed.
- **Blank page after deploy**: Confirm the `VITE_API_URL` is set and reachable.
- **Auth issues**: Ensure `Authorization` header token is stored in `localStorage` as `token`.
