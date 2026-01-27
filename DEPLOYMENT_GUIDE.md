# Rosco's Moving CRM - Deployment & Integration Guide

## Overview

This is a complete moving company management platform built with React, Express, and MySQL. It includes:

- **Quote Calculator** - Multi-step form with room-by-room inventory
- **Admin Dashboard** - Business metrics and operations management
- **Settings Page** - Configure pricing, crew, vehicles, and PayPal
- **Email Notifications** - Automatic alerts for quote submissions
- **PayPal Integration** - 20% deposit collection after quotes

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ (https://nodejs.org)
- MySQL 8.0+ (https://www.mysql.com/downloads/)
- pnpm package manager (`npm install -g pnpm`)

### Installation

1. **Clone/Extract the project**
   ```bash
   cd roscos-crm
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/roscos_crm
   JWT_SECRET=your-secret-key-here-change-this
   VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
   VITE_PAYPAL_CLIENT_SECRET=your-paypal-client-secret
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

---

## PayPal Setup

### Get Your PayPal Credentials

1. Go to https://developer.paypal.com
2. Sign in with your PayPal Business account
3. Click **Apps & Credentials**
4. Select **Sandbox** (for testing) or **Live** (for production)
5. Under **REST API apps**, click **Create App**
6. Copy your **Client ID** and **Secret**
7. Add these to your `.env` file and the Settings page

### Configure in Settings Page

1. Go to `/settings` in your CRM
2. Click the **PayPal** tab
3. Paste your Client ID and Secret
4. Set deposit percentage (default: 20%)
5. Click **Save PayPal Configuration**

---

## Integration with Your Website

### Option A: Embed Quote Form as iframe (Easiest)

Add this code to your roscosmoving.com website:

```html
<!-- Add this where you want the quote form to appear -->
<div style="width: 100%; max-width: 800px; margin: 0 auto;">
  <iframe 
    src="https://your-crm-domain.com/quote" 
    width="100%" 
    height="1200" 
    frameborder="0"
    style="border: none; border-radius: 8px;"
  ></iframe>
</div>
```

Replace `https://your-crm-domain.com` with your actual CRM URL.

### Option B: Replace Your Website (Best Long-term)

Point your roscosmoving.com domain to this CRM system:

1. Deploy the CRM to your hosting provider
2. Update your domain DNS to point to the CRM server
3. The quote form becomes your homepage
4. Customers access everything from one site

---

## Deployment Options

### Option 1: Deploy to Railway (Recommended - Easiest)

1. **Create Railway account** - https://railway.app
2. **Connect GitHub** - Push your code to GitHub
3. **Create new project** - Select "Deploy from GitHub"
4. **Add MySQL database** - Railway provides managed MySQL
5. **Set environment variables** - Add your `.env` variables in Railway dashboard
6. **Deploy** - Railway automatically deploys on every push

### Option 2: Deploy to Render

1. **Create Render account** - https://render.com
2. **Create Web Service** - Connect your GitHub repo
3. **Add PostgreSQL database** - Render provides managed databases
4. **Set environment variables** - Add your `.env` variables
5. **Deploy** - Render automatically deploys

### Option 3: Deploy to Your Own Server

1. **SSH into your server**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Node.js and MySQL**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs mysql-server
   ```

3. **Clone your project**
   ```bash
   git clone your-repo-url
   cd roscos-crm
   ```

4. **Install dependencies**
   ```bash
   pnpm install
   ```

5. **Build for production**
   ```bash
   pnpm build
   ```

6. **Set up environment variables**
   ```bash
   nano .env
   ```

7. **Start the server**
   ```bash
   pnpm start
   ```

8. **Use PM2 to keep it running**
   ```bash
   sudo npm install -g pm2
   pm2 start dist/index.js --name "roscos-crm"
   pm2 startup
   pm2 save
   ```

---

## Features Overview

### Dashboard (`/dashboard`)
- View pending quotes
- See scheduled jobs
- Track revenue
- Monitor crew utilization
- View conversion rates

### Quote Calculator (`/quote`)
- 5-step multi-step form
- Room-by-room inventory selection
- Appliance selection
- Special items (stairs, elevator, etc.)
- Instant quote calculation
- Email submission to contact@roscosmoving.com
- 20% deposit payment via PayPal

### Settings (`/settings`)
- **Company Info** - Name, phone, email, address
- **Pricing Rules** - Base cost, per-mile rate, labor rates
- **Crew Management** - Add/remove crew members
- **Vehicle Management** - Add/remove trucks and equipment
- **PayPal Configuration** - Connect your PayPal account

---

## Email Configuration

### Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Update your `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### Custom Email Server

If using a custom email provider, update `server/email.ts` with your SMTP settings.

---

## Database Schema

The system uses 10 tables:

- **users** - Admin accounts
- **leads** - Customer inquiries
- **quotes** - Quote calculations
- **jobs** - Moving jobs
- **invoices** - Billing records
- **crew** - Team members
- **vehicles** - Trucks and equipment
- **pricingRules** - Dynamic pricing configuration
- **billsOfLading** - Digital BOL documents
- **notifications** - System notifications

---

## API Endpoints

### Public Endpoints
- `GET /` - Home page
- `GET /quote` - Quote calculator form
- `POST /api/trpc/leads.create` - Submit quote request

### Protected Endpoints (Admin only)
- `GET /dashboard` - Admin dashboard
- `GET /settings` - Settings page
- `POST /api/trpc/leads.list` - Get all leads
- `POST /api/trpc/jobs.create` - Create job
- `POST /api/trpc/quotes.calculate` - Calculate quote

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution:** Ensure MySQL is running and DATABASE_URL is correct

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution:** Change port in `server/_core/index.ts` or kill process: `lsof -i :3000`

### PayPal Not Working
- Verify Client ID and Secret are correct
- Check that you're using Sandbox credentials for testing
- Ensure VITE_PAYPAL_CLIENT_ID is set in frontend `.env`

### Email Not Sending
- Verify Gmail App Password is correct
- Check that 2FA is enabled on Gmail
- Ensure EMAIL_USER and EMAIL_PASSWORD are set

---

## File Structure

```
roscos-crm/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── lib/trpc.ts       # tRPC client
│   │   └── App.tsx           # Main router
│   └── index.html
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedures
│   ├── db.ts                 # Database queries
│   ├── email.ts              # Email notifications
│   └── _core/                # Framework code
├── drizzle/                  # Database schema
│   └── schema.ts
├── package.json
├── vite.config.ts
└── drizzle.config.ts
```

---

## Security Best Practices

1. **Change JWT_SECRET** - Use a strong random string
2. **Use HTTPS** - Always use SSL/TLS in production
3. **Protect .env** - Never commit `.env` to version control
4. **Database Backups** - Regular backups of your MySQL database
5. **Update Dependencies** - Run `pnpm update` regularly
6. **Validate Input** - All user input is validated on server
7. **Rate Limiting** - Consider adding rate limiting for API endpoints

---

## Support & Next Steps

### To Add More Features:
1. Update database schema in `drizzle/schema.ts`
2. Run `pnpm db:push` to migrate
3. Add backend procedures in `server/routers.ts`
4. Build frontend components in `client/src/pages/`
5. Test with `pnpm test`
6. Deploy with `pnpm build && pnpm start`

### To Customize:
- Edit colors in `client/src/index.css`
- Modify pricing logic in `server/routers.ts`
- Update email templates in `server/email.ts`
- Change UI components in `client/src/pages/`

---

## Questions?

Refer to the README.md for technical details about the tech stack and architecture.

Good luck with your moving business! 🚚
