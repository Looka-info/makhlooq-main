<div align="center">
  <img src="public/logo.png" alt="Khalai Makhlooq Logo" width="150" />
  <h1>Khalai Makhlooq (KHLA) Command Center</h1>
  
  <p>
    <strong>Official Web Infrastructure, Roster, & Fleet Management System</strong>
  </p>

  <p>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" /></a>
    <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-WebGL-white?style=for-the-badge&logo=three.js" alt="Three.js" /></a>
  </p>
</div>

<br />

<div align="center">
  <img src="public/backgrounds/Screenshot_2025-09-10_231035.png" alt="Dashboard Preview" width="800" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 243, 255, 0.15);" />
</div>

<br />

> A highly immersive, interactive, and automated web presence for the **Khalai Makhlooq** Star Citizen organization. Built with modern web technologies, featuring real-time roster syncing, a dynamic 3D fleet viewer, and a securely integrated administrative control panel.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📸 Gallery](#-gallery)
- [⚙️ Local Development Setup](#️-local-development-setup)
- [📂 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)

---

## ✨ Key Features

### 🌐 Automated Roster Synchronization
Includes a dedicated Discord bot running silently in the background, communicating with `starcitizen-api.com`. It automatically fetches live organizational data (handles, ranks, avatars) and syncs it to our database every 12 hours.

### 🛸 3D Fleet Viewer & Command System
Explore the organization's fleet in an interactive 3D viewport powered by Three.js. Supports loading high-fidelity `.glb` ship models or generating intelligent holographic fallbacks based on the ship's classification. Directly integrated with the **FleetYards API**.

### 📊 Interactive Team Network Graph
An immersive, physics-based, Obsidian-style network graph that visualizes the organization's roster, connecting members back to the central KHLA hub.

### 🛡️ Fleet Admin Panel
A secure management dashboard protected by Supabase Auth and Discord OAuth. Authorized admins can dynamically register new fleet slugs, toggle visibility, and validate configurations in real-time against FleetYards.

### 🎨 Premium UI/UX Aesthetics
Built with a "vibe-engineered" approach utilizing glassmorphism, deep contrast cyberpunk themes, modern HUD interfaces, micro-interactions, and buttery-smooth page transitions via `motion/react`.

---

## 🛠️ Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend Core** | Next.js 14 (App Router), React 18, TypeScript/JavaScript |
| **Styling & UI** | Tailwind CSS, Vanilla CSS, Lucide React, Framer Motion |
| **3D Rendering** | Three.js, `@react-three/fiber`, `@react-three/drei` |
| **Backend & Auth** | Supabase (PostgreSQL), Next.js API Routes, Discord OAuth2 |
| **External APIs** | StarCitizen-API, FleetYards Public API |

---

## 📸 Gallery

<div align="center">
  <img src="public/backgrounds/Screenshot_2025-09-10_231238.png" alt="Fleet 3D Viewer" width="48%" style="border-radius: 8px;" />
  <img src="public/backgrounds/Screenshot_2025-09-10_231349.png" alt="Team Roster" width="48%" style="border-radius: 8px;" />
</div>
<br />
<div align="center">
  <img src="public/backgrounds/Screenshot_2025-09-10_231415.png" alt="Admin Dashboard" width="800" style="border-radius: 8px;" />
</div>

---

## ⚙️ Local Development Setup

### 1. Prerequisites
- **Node.js** (v18+)
- A **Supabase Project** (Database & Auth)
- A **Discord Developer Application** (for Bot and OAuth)
- A **StarCitizen-API.com Key**

### 2. Environment Variables
Create a `.env.local` file in the root directory and populate it:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Discord OAuth & Bot Configuration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_server_id

# External APIs
SC_API_KEY=your_starcitizen_api_key
```

### 3. Database Initialization
Run the SQL migration files found in the `/supabase/migrations` folder inside your Supabase SQL Editor. Ensure you apply schemas for:
- `fleet_ships`
- `team_members`
- `fleet_configs` (Admin registry)

### 4. Running the Project

**Start the Next.js Web Application:**
```bash
npm install
npm run dev
```
The website will be available at `http://localhost:3000`.

**Start the Discord Sync Bot (In a separate terminal):**
```bash
cd discord-bot-master
npm install
node deploy-commands.js # Register slash commands
npm run start
```

---

## 📂 Project Structure

```text
makhlooq/
├── app/                  # Next.js App Router (Home, Fleet, Team, About, Admin)
│   ├── api/              # Serverless API endpoints (Supabase & FleetYards Proxy)
│   └── globals.css       # Global stylesheet with custom UI components
├── src/
│   └── components/       # Reusable React components (3D Scene, Modals, UI)
├── public/               # Static assets (Images, Logos, Backgrounds)
├── supabase/             # Database migration SQL files
└── discord-bot-master/   # Standalone Node.js sync bot
```

---

## 🤝 Contributing
For organization members looking to contribute code or 3D models:
1. Ensure all `.glb` files are optimized and compressed (Draco compression recommended).
2. Create feature branches off of `main` (e.g., `feature/hud-improvements`).
3. Run `npm run lint` and verify hydration stability before opening a Pull Request.

<br />

<div align="center">
  <img src="public/favicon.png" width="40" alt="Icon" />
  <br />
  <i>See You In The 'Verse.</i>
</div>
