# Railway Deployment Troubleshooting Guide for Rosco's CRM

Deploying a full-stack application can sometimes present challenges. This guide covers the most common issues you might encounter when deploying your Rosco's CRM project to Railway and provides clear, actionable steps to resolve them.

## How to Check Logs on Railway

The first step in troubleshooting any deployment issue is to **check the logs**. Railway provides real-time logs for both the build process and the running application.

1.  **Navigate to Your Service**: Open your project on Railway and click on the `Rosco-crm` service.
2.  **View Logs**: Click on the **Deployments** tab. You can see logs for each deployment. A green light indicates a successful deployment, while red indicates a failure.

    *   **Build Logs**: These show the output of the `pnpm install && pnpm build` command. Check here for errors related to package installation or the build process.
    *   **Deploy Logs**: These show the output from your running application after it has been built. Check here for runtime errors, such as database connection failures or crashes.

--- 

## Common Deployment Issues and Solutions

Here is a breakdown of potential problems, their symptoms, and how to fix them.

### 1. Build Failures

If your deployment fails during the build step, it will be marked as `FAILED` in the deployments tab.

| Symptom / Error Message | Cause | Solution |
| :--- | :--- | :--- |
| `pnpm: command not found` | Railway's build environment might not have `pnpm` in its default path. | Your `package.json` specifies `pnpm` as the package manager, so Railway's Nixpacks builder should automatically use it. If this fails, you can add a `railway.toml` file to your repository to specify the `pnpm` version. |
| `Error: Could not resolve [...]` or `Module not found` | A package is missing from `package.json` or failed to install. | Ensure all dependencies are listed in `package.json`. If the error persists, try clearing the build cache in Railway's settings and redeploying. |
| TypeScript or `tsc` errors | There is a type error in your code that prevents the project from building. | Check the build logs for the specific file and line number causing the error. Fix the type error, commit the change, and push to GitHub to trigger a new deployment. |

### 2. Deployment Crashes or Restarts

If the build succeeds but the application fails to start or continuously restarts, the issue is likely at runtime.

| Symptom / Error Message | Cause | Solution |
| :--- | :--- | :--- |
| `Error: connect ECONNREFUSED` or `Cannot connect to database` | The `DATABASE_URL` is incorrect, or the database is not ready. | 1.  **Verify `DATABASE_URL`**: In Railway, go to your `Rosco-crm` service's **Variables** tab and ensure `DATABASE_URL` is present and correctly formatted. It should have been injected automatically when you created the MySQL service. <br> 2.  **Check Database Status**: Go to your MySQL service in Railway and ensure it is running and healthy. |
| `Error: JWT_SECRET is not set` | The `JWT_SECRET` environment variable is missing. | Go to the **Variables** tab and add `JWT_SECRET` with a strong, random string as its value. |
| `Crash: service exited with non-zero code` | This is a generic error. It could be caused by a missing environment variable, a code error, or a port issue. | **Check the deploy logs immediately** after a crash. The logs will contain the specific error message that caused the application to exit. Address the underlying issue (e.g., add a missing variable, fix a bug). |

### 3. Application is Running but Features Fail

Sometimes the application deploys successfully, but specific features do not work as expected.

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **Quote form is not visible** on your Namecheap website. | 1.  The `<iframe>` URL is incorrect. <br> 2.  The CRM application has crashed. | 1.  **Check the `src` attribute** of your `<iframe>`. It must be the full, correct URL of your Railway deployment, including the `/quote` path. <br> 2.  **Verify the CRM is running**: Visit your Railway URL directly in a browser. If it doesn't load, check the deployment logs on Railway. |
| **PayPal payments are not working**. | 1.  Incorrect PayPal credentials. <br> 2.  Using Sandbox credentials in a Live environment (or vice-versa). | 1.  **Double-check your PayPal variables** (`VITE_PAYPAL_CLIENT_ID` and `VITE_PAYPAL_CLIENT_SECRET`) in Railway. Ensure there are no typos or extra spaces. <br> 2.  Make sure you are using your **Live** credentials from the PayPal Developer Dashboard, not the Sandbox ones. |
| **Email notifications are not being sent**. | 1.  Incorrect `EMAIL_USER` or `EMAIL_PASSWORD`. <br> 2.  The `EMAIL_PASSWORD` is your regular Gmail password, not an App Password. <br> 3.  2-Factor Authentication (2FA) is not enabled on the Gmail account. | 1.  **Verify the email credentials** in your Railway environment variables. <br> 2.  **Generate and use a Google App Password**. You cannot use your regular account password. You must have 2FA enabled on the Google account to generate an App Password. |

By systematically checking the logs and verifying your configuration, you can resolve most deployment issues. Always start with the deployment logs on Railway, as they provide the most direct clues to what is going wrong.
