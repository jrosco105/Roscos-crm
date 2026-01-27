# Railway Deployment Guide for Rosco's CRM

Your GitHub repository is now set up and ready for deployment. This guide provides step-by-step instructions to deploy your application to Railway.

Your project includes a `railway.json` file, which will automate most of the configuration. You will primarily need to set up the database and environment variables.

## Step 1: Create a New Project on Railway

1.  **Sign in to Railway**: Go to [railway.app](https://railway.app) and log in.
2.  **Create a New Project**: From your dashboard, click **New Project**.
3.  **Deploy from GitHub Repo**: Select this option and choose your `Roscos-crm` repository. Railway will automatically start analyzing your project.

## Step 2: Add a MySQL Database

Your application requires a MySQL database. Railway can provision one for you.

1.  **Add a New Service**: Inside your new Railway project, click **New**.
2.  **Select Database**: Choose **MySQL** from the list of available services.

Railway will create a new MySQL database service and automatically link it to your `Roscos-crm` application service. This means it will inject the `DATABASE_URL` environment variable for you.

## Step 3: Configure Environment Variables

This is the most critical step. Your application needs several secret keys and credentials to function correctly. You must add these manually to your Railway project.

1.  **Navigate to Variables**: In your `Roscos-crm` service on Railway, click on the **Variables** tab.
2.  **Add New Variables**: You will see that `DATABASE_URL` is already present. You need to add the following variables. Click **New Variable** for each one.

| Variable Name               | Description                                                                                             | How to Get It                                                                                              | Example Value                       |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `JWT_SECRET`                | A strong, random secret key for signing authentication tokens.                                          | You can generate one using a password manager or an online generator.                                      | `a-very-long-and-random-string`     |
| `VITE_PAYPAL_CLIENT_ID`     | Your **Live** PayPal application's Client ID for processing payments.                                     | From your [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/live).          | `your-paypal-live-client-id`        |
| `VITE_PAYPAL_CLIENT_SECRET` | Your **Live** PayPal application's Secret.                                                              | From your [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/live).          | `your-paypal-live-secret`           |
| `EMAIL_USER`                | The Gmail address you will use to send notification emails.                                             | Your business Gmail address.                                                                               | `contact@roscosmoving.com`          |
| `EMAIL_PASSWORD`            | The [Google App Password](https://myaccount.google.com/apppasswords) for the email account.             | Generate this from your Google Account settings. **Do not use your regular password.**                     | `your-16-character-app-password`    |
| `NODE_ENV`                  | Sets the environment to production.                                                                     | Set this to `production`.                                                                                  | `production`                        |

**Important**: After adding these variables, Railway will automatically trigger a new deployment to apply them.

## Step 4: Deployment and Domain

Railway will handle the deployment process automatically. The `railway.json` file in your repository tells Railway how to build and start your application:

-   **Build Command**: `pnpm install && pnpm build`
-   **Start Command**: `pnpm start`

Once the deployment is complete, you can access your live application.

1.  **Find Your URL**: Go to your `Roscos-crm` service's **Settings** tab in Railway.
2.  **Public Networking**: Under the "Networking" section, you will find a public URL ending in `.up.railway.app`. This is the live URL for your CRM.
3.  **(Optional) Custom Domain**: You can also link your own custom domain (e.g., `crm.roscosmoving.com`) in this section.

## Step 5: Integrate with Your Website

Now that your CRM is live, you can embed the quote calculator into your Namecheap-hosted website using the `<iframe>` method described previously. Use the public URL from Railway as the `src` for the iframe.

```html
<iframe 
  src="https://your-crm-production-url.up.railway.app/quote"
  width="100%" 
  height="1200" 
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;"
></iframe>
```

Your setup is now complete. Your application is hosted on Railway, with continuous deployment enabled from your GitHub repository. Any changes you push to the `main` branch will automatically be deployed.
