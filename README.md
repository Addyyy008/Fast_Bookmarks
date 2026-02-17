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

## Getting Started

### 1. Clone and Install

```bash
cd my-app
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Project Settings → API
3. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Configure Database

1. In Supabase Dashboard, go to SQL Editor
2. Open `supabase_schema.sql` from this project
3. Run the SQL script to create the bookmarks table and policies

### 4. Enable Google OAuth

1. In Supabase Dashboard, go to Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials (or use Supabase's default for development)
4. Add your site URL to Redirect URLs:
   - `http://localhost:3000/auth/callback` (for development)
   - Your production URL when deploying

### 5. Enable Realtime

1. Go to Database → Replication
2. Ensure `bookmarks` table is in the `supabase_realtime` publication

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
├── supabase_schema.sql           # Database setup script
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

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update Supabase OAuth redirect URLs with production URL
5. Deploy!

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NEXT_PUBLIC_SUPABASE_URL | Your Supabase project URL | Yes |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anon key | Yes |

## Troubleshooting

### Real-time not working
- Check if Realtime is enabled in Supabase Dashboard
- Verify the `bookmarks` table is in the `supabase_realtime` publication

### OAuth not working
- Ensure redirect URLs are configured in Supabase
- Check that Google provider is enabled

### "Failed to add bookmark" error
- Verify user is authenticated
- Check RLS policies are properly configured
- Check browser console for detailed errors

## License

MIT
=======
