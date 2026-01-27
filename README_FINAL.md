# Rosco's Moving CRM - Final Product

## What You Have

This is a **complete, production-ready moving company management platform** with:

✅ **Quote Calculator** - Multi-step form with room-by-room inventory  
✅ **Admin Dashboard** - Business metrics and operations  
✅ **Settings Page** - Configure pricing, crew, vehicles, PayPal  
✅ **Email Notifications** - Automatic quote submission alerts  
✅ **PayPal Integration** - 20% deposit collection  
✅ **Database** - MySQL with 10 tables for all business data  
✅ **Responsive Design** - Works on desktop, tablet, mobile  

---

## Getting Started (3 Steps)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database
```bash
pnpm db:push
```

### 3. Start Development
```bash
pnpm dev
```

Visit `http://localhost:3000`

---

## Key Files

- **DEPLOYMENT_GUIDE.md** - How to deploy to production
- **WEBSITE_INTEGRATION.md** - How to add quote form to your website
- **drizzle/schema.ts** - Database structure
- **server/routers.ts** - Backend API procedures
- **client/src/pages/** - Frontend pages

---

## Features

### For Customers
- Fill out detailed quote form
- See instant estimate
- Pay 20% deposit via PayPal
- Receive confirmation email

### For You (Admin)
- Dashboard with business metrics
- View all quotes and leads
- Manage crew and vehicles
- Configure pricing rules
- Set up PayPal payments
- Receive email notifications

---

## Deployment

Choose one:

1. **Railway** (Easiest) - https://railway.app
2. **Render** - https://render.com
3. **Your own server** - VPS/dedicated server
4. **Manus** - Already running at https://3000-i8et6t7c22b0ccli2n1qd-c37ab18a.us1.manus.computer

See **DEPLOYMENT_GUIDE.md** for detailed instructions.

---

## Integration with Your Website

Add this to your roscosmoving.com:

```html
<iframe 
  src="https://YOUR-CRM-URL.com/quote" 
  width="100%" 
  height="1200" 
  frameborder="0"
></iframe>
```

See **WEBSITE_INTEGRATION.md** for more options.

---

## Project Structure

```
roscos-crm/
├── client/              # React frontend
├── server/              # Express backend
├── drizzle/             # Database schema
├── package.json
├── vite.config.ts
└── DEPLOYMENT_GUIDE.md
```

---

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, TypeScript
- **Backend**: Express, tRPC, Node.js
- **Database**: MySQL
- **Payments**: PayPal SDK
- **Deployment**: Docker-ready

---

## Environment Variables

Create `.env` file:

```
DATABASE_URL=mysql://user:password@localhost:3306/roscos_crm
JWT_SECRET=your-secret-key-here
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id
VITE_PAYPAL_CLIENT_SECRET=your-paypal-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

---

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm test         # Run tests
pnpm db:push      # Migrate database
pnpm format       # Format code
```

---

## Support

- Read **DEPLOYMENT_GUIDE.md** for deployment help
- Read **WEBSITE_INTEGRATION.md** for website integration
- Check the template README.md for technical details
- Review database schema in `drizzle/schema.ts`

---

## Next Steps

1. ✅ Extract this ZIP file
2. ✅ Run `pnpm install`
3. ✅ Set up `.env` file
4. ✅ Run `pnpm db:push`
5. ✅ Run `pnpm dev` to test locally
6. ✅ Deploy to production (see DEPLOYMENT_GUIDE.md)
7. ✅ Add to your website (see WEBSITE_INTEGRATION.md)
8. ✅ Configure Settings page (pricing, PayPal, company info)
9. ✅ Go live!

---

## Important Notes

- **Change JWT_SECRET** to a random string in production
- **Use HTTPS** only in production
- **Backup your database** regularly
- **Keep dependencies updated** with `pnpm update`
- **Test locally first** before deploying

---

Good luck with your moving business! 🚚

For questions, refer to the documentation files included in this package.
