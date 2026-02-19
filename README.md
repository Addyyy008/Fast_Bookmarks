# Fast_Bookmarks

A simple bookmark manager with Google OAuth, real-time updates, and user-specific private bookmarks.

## Features

- Sign up and log in using Google OAuth (no email/password)
- Add bookmarks with URL and title
- Bookmarks are private to each user
- Real-time updates across multiple tabs
- Delete bookmarks with confirmation
- Clean, responsive UI with Tailwind CSS

## Tech Stack

- **Next.js 16** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** (Styling)
- **TypeScript**

## Project Structure

```
my-app/
├── app/
│   ├── auth/callback/route.ts    # OAuth callback handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── AuthButton.tsx            # Sign in/out button
│   ├── BookmarkForm.tsx          # Add bookmark form
│   ├── BookmarkItem.tsx          # Individual bookmark item
│   ├── BookmarkList.tsx          # Real-time bookmark list
│   └── Providers.tsx             # App providers
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   ├── database.types.ts         # Database types
│   └── types.ts                  # App types
├── .env.local.example            # Environment variables template
└── README.md                     # This file
```

## How It Works

### Authentication Flow
1. User clicks "Sign in with Google"
2. Supabase redirects to Google OAuth
3. After Google authentication, user is redirected back to `/auth/callback`
4. Callback exchanges code for session and redirects to home

### Real-time Updates
1. When a bookmark is added/deleted, Supabase sends a real-time event
2. All open tabs receive the event via WebSocket
3. UI updates instantly without page refresh

### Data Privacy
- Row Level Security (RLS) policies ensure users can only access their own bookmarks
- Policies are enforced at the database level
- Even if someone bypasses the UI, they can't access other users' data

## Database Schema

### bookmarks table
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| url | TEXT | Bookmark URL |
| title | TEXT | Bookmark title |
| created_at | TIMESTAMP | Creation time |

## Deployment

### Deploy to Vercel

=======
