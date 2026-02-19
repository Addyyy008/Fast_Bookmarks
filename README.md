# Fast_Bookmarks 🚀

A simple bookmark manager with Google OAuth, real-time updates, and user-specific private bookmarks.

---

## 🧭 Overview
This project implements a personal bookmark manager with Google Sign-In, per-user data isolation, and (when wired) real-time updates using Supabase. Built with Next.js (App Router) and Tailwind CSS.

---

## 🛠️ What I Built

- User authentication with Google (Supabase Auth) 🔐
- CRUD for bookmarks: create, read, update, delete 🗂️
- Per-user data isolation (Row-Level Security) 🛡️
- Real-time updates across tabs (when configured) ⚡
- Delete bookmarks with confirmation 🗑️
- Clean, responsive UI with Tailwind CSS 🎨

---

## 🧰 Tech Stack

- Next.js 16 (App Router) 🧭
- Supabase (Auth, Database, Realtime) 🔥
- Tailwind CSS for styling 🎨
- TypeScript for type safety 🛡️
- Optional: AI-assisted planning (used for planning; code written by me) 🤖

---

## 🗂️ Project Structure

my-app/ ├── app/ │ ├── auth/callback/route.ts # OAuth callback handler │ ├── globals.css # Global styles │ ├── layout.tsx # Root layout │ └── page.tsx # Main page ├── components/ │ ├── AuthButton.tsx # Sign in/out button │ ├── BookmarkForm.tsx # Add bookmark form │ ├── BookmarkItem.tsx # Individual bookmark item │ ├── BookmarkList.tsx # Real-time bookmark list │ └── Providers.tsx # App providers ├── lib/ │ ├── supabase/ │ │ ├── client.ts # Browser Supabase client │ │ └── server.ts # Server Supabase client │ ├── database.types.ts # Database types │ └── types.ts # App types ├── .env.local.example # Environment variables template └── README.md # This file


---

## 🧭 How It Works

### 🔐 Authentication Flow
1. User clicks "Sign in with Google" 🔒
2. Supabase redirects to Google OAuth and back to the app
3. The login session is used for subsequent requests

### ⚡ Real-time Updates
- When a bookmark is added or deleted, Supabase broadcasts events via WebSockets
- All open tabs receive updates and the UI updates in real time

### 🛡️ Data Privacy
- Row-Level Security (RLS) ensures users only access their own bookmarks
- Policies are enforced at the database level for privacy and security

---

## 🗄️ Database Schema

### bookmarks table
| Column     | Type                                 | Description              |
|------------|--------------------------------------|--------------------------|
| id         | UUID                                 | Primary key              |
| user_id    | UUID                                 | FK to auth.users(id)     |
| url        | TEXT                                 | Bookmark URL             |
| title      | TEXT                                 | Bookmark title           |
| created_at | TIMESTAMP WITH TIME ZONE DEFAULT now() | Creation time              |

---

## 🚀 Deployment

- Vercel auto-deploys on git push (if configured)
- If you update env vars, redeploy or re-run a deployment
- For a fresh start, you can create a new Supabase project and repeat the steps, then update your app to point to the new URLs/keys

---

## 🧰 Challenges & Learnings
- Setting up real-time with per-user auth on a new Supabase project
- Ensuring the token is passed to the WebSocket (auth flow for realtime)
- Handling a clean separation between auth client and realtime client
- Validating multi-tab workflows and end-to-end testing

---


