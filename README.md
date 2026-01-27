# Rosco's Moving CRM

A complete, production-ready moving company management platform with quote calculator, admin dashboard, and PayPal integration.

## Features

- **Quote Calculator** - Multi-step form with room-by-room inventory
- **Admin Dashboard** - Business metrics and operations management
- **Settings Page** - Configure pricing, crew, vehicles, and PayPal
- **Email Notifications** - Automatic alerts for quote submissions
- **PayPal Integration** - 20% deposit collection after quotes
- **Database** - MySQL with 10 tables for all business data
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, tRPC
- **Database**: MySQL, Drizzle ORM
- **Payments**: PayPal SDK
- **Package Manager**: pnpm

## Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- pnpm (`npm install -g pnpm`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/roscos-crm.git
   cd roscos-crm
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. **Set up database**
   ```bash
   pnpm db:push
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `VITE_PAYPAL_CLIENT_ID` | PayPal Client ID | Yes |
| `VITE_PAYPAL_CLIENT_SECRET` | PayPal Secret | Yes |
| `EMAIL_USER` | Gmail address for notifications | Yes |
| `EMAIL_PASSWORD` | Gmail App Password | Yes |
| `PORT` | Server port (default: 3000) | No |

## Deployment

### Deploy to Railway

1. Push your code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Add a MySQL database
5. Set environment variables
6. Deploy!

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Website Integration

To embed the quote calculator in your existing website:

```html
<iframe 
  src="https://your-crm-domain.com/quote" 
  width="100%" 
  height="1200" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

See [WEBSITE_INTEGRATION.md](./WEBSITE_INTEGRATION.md) for more options.

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm test         # Run tests
pnpm db:push      # Migrate database
pnpm format       # Format code
```

## Project Structure

```
roscos-crm/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   └── lib/        # Utilities and tRPC client
├── server/              # Express backend
│   ├── routers.ts      # tRPC procedures
│   ├── db.ts           # Database queries
│   └── _core/          # Framework code
├── drizzle/            # Database schema
│   └── schema.ts
├── package.json
└── vite.config.ts
```

## Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - How to deploy to production
- [Website Integration](./WEBSITE_INTEGRATION.md) - How to add to your website
- [Final Product Overview](./README_FINAL.md) - Feature overview

## License

MIT

## Support

For questions or issues, please refer to the documentation files included in this repository.
