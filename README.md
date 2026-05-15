<div align="center">
  <img src="https://makhlooq.com/logo.png" alt="Khalai Makhlooq Logo" width="120" />
  <h1>Khalai Makhlooq (KHLA)</h1>
  <p><strong>Official Web Infrastructure & Fleet Command System</strong></p>
</div>

<br />

A highly immersive, interactive, and automated web presence for the **Khalai Makhlooq** Star Citizen organization. Built with modern web technologies, featuring real-time roster syncing, a 3D fleet viewer, and an administrative control panel integrated securely with Discord.

---

## 🚀 Key Features

*   **🌐 Automated Roster Synchronization**
    Includes a dedicated Discord bot that runs silently in the background, communicating with `starcitizen-api.com`. It automatically fetches live organizational data (handles, ranks, avatars) and syncs it to our database every 12 hours.
*   **🛸 3D Fleet Viewer & Command System**
    Explore the organization's fleet in an interactive 3D viewport powered by Three.js. Supports loading high-fidelity `.glb` ship models via URL or generating intelligent holographic fallbacks based on the ship's class.
*   **📊 Interactive Team Network Graph**
    An immersive, physics-based, Obsidian-style network graph that visualizes the organization's roster, connecting members back to the central KHLA hub.
*   **🛡️ Fleet Admin Panel**
    A secure management dashboard protected by Discord OAuth. Authorized admins can register new ships, tweak combat profiles (Shields, Armor, Firepower), and customize the HUD accent colors for the 3D viewer.
*   **✨ Premium UI/UX Aesthetics**
    Built with a "vibe-engineered" approach utilizing glassmorphism, deep contrast themes, micro-interactions, and buttery-smooth page transitions via Framer Motion.

---

## 🛠️ Tech Stack

### **Frontend (Web App)**
*   **Core**: [Next.js 14](https://nextjs.org/) (App Router) & React
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **3D Rendering**: [Three.js](https://threejs.org/), `@react-three/fiber`, and `@react-three/drei`
*   **Icons**: [Lucide React](https://lucide.dev/)

### **Backend & Infrastructure**
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Discord OAuth2)
*   **Bot Framework**: Node.js & [Discord.js](https://discord.js.org/)
*   **External Data**: [StarCitizen-API](https://starcitizen-api.com/)

---

## ⚙️ Local Development Setup

### 1. Prerequisites
*   Node.js (v18+)
*   A Supabase Project
*   A Discord Developer Application (for Bot and OAuth)
*   A StarCitizen-API.com Key

### 2. Environment Variables
Create a `.env.local` file in the root directory and populate it with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Discord OAuth & Bot Configuration
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_server_id

# External APIs
SC_API_KEY=your_starcitizen_api_key
```

### 3. Database Initialization
Run the SQL migration files found in the `/supabase/migrations` folder inside your Supabase SQL Editor to set up the `fleet_ships` and `team_members` tables along with their RLS policies.

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
├── app/                  # Next.js App Router pages (Home, Fleet, Team, Admin)
├── src/
│   └── components/       # Reusable React components (3D Scene, UI, Modals)
├── public/               # Static assets (Images, Videos, placeholder .glb models)
├── supabase/             # Database migration SQL files
└── discord-bot-master/   # Standalone Node.js sync bot & slash commands
```

---

## 🤝 Contributing
For organization members looking to contribute code or 3D models, please ensure all `.glb` files are optimized and compressed before linking them in the Fleet Admin registry.

<div align="center">
  <i>See You In The 'Verse.</i>
</div>
