# TAPs vCard Sharing - Vercel Deployment

This project provides a public vCard template sharing URL feature for the TAPs mobile app. It's built with Next.js and deployed on Vercel, using Supabase as the database.

## Features

- Dynamic vCard profile pages at `/v/[profile_id]`
- Server-side rendering for optimal performance and SEO
- Responsive design that works on all devices
- Secure data access via Supabase
- Easy deployment to Vercel

## Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── v/[profile_id]/     # Dynamic route for vCard profiles
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   ├── not-found.jsx       # 404 page
│   └── page.js             # Home page
├── components/             # React components
│   └── VCardComponent.jsx  # Main vCard component
├── lib/                    # Utility functions
│   └── supabase.js         # Supabase client and data fetching
├── public/                 # Static assets
└── ... configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials (see `.env.local.example`)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Create a new project on [Vercel](https://vercel.com)
3. Import your Git repository
4. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Supabase Configuration

Ensure your Supabase project has the following tables:

- `profiles`: Stores user profile information
- `social_links`: Stores social media links for profiles
- `templates`: Stores vCard template designs

Set up Row Level Security (RLS) policies to ensure data is protected while still allowing public access to shared profiles.

## Rendering Strategy

This project uses Server-Side Rendering (SSR) for optimal performance and SEO benefits. The `dynamic = 'force-dynamic'` option ensures fresh data on each request.

## License

MIT