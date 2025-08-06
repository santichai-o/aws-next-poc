# PII Data Management System

A Next.js application for managing Personal Identifiable Information (PII) data.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
├── app/                  # Next.js 13+ App Router
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── loading.tsx      # Loading UI
│   ├── error.tsx        # Error UI
│   └── not-found.tsx    # 404 page
├── components/          # Reusable components
│   └── ui/             # UI components
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
├── .env.example        # Environment variables example
└── next.config.js      # Next.js configuration
```

### Features

- ✅ Next.js 13+ with App Router
- ✅ TypeScript support
- ✅ API routes
- ✅ Basic UI components
- ✅ Environment configuration
- ✅ Error handling
- ✅ Loading states

### Development

Edit files in the `app/` directory to add new pages and functionality.

### Deployment

This application can be deployed to:
- Vercel (recommended)
- Netlify
- Docker container

For production deployment, make sure to:
1. Set up proper environment variables
2. Configure database connections (if needed)
3. Set up proper security headers
4. Enable SSL/HTTPS
