# How to Enter Environment Variables in Railway: A Step-by-Step Guide

This guide provides precise, step-by-step instructions on how to add the necessary environment variables to your Rosco's CRM project on Railway. Environment variables are used to store sensitive information like API keys and database credentials securely, outside of your source code.

## Step 1: Navigate to the Variables Tab

First, you need to get to the right place in your Railway project dashboard.

1.  **Log in to Railway**: Go to [railway.app](https://railway.app) and open your project.
2.  **Select Your Service**: You will see at least two services: your application (likely named `Roscos-crm` or `jrosco105/Roscos-crm`) and your database (e.g., `MySQL`). Click on your **application service**.
3.  **Open the Variables Tab**: In the service view, you will see several tabs like "Deployments," "Metrics," and "Settings." Click on the **Variables** tab.

    You should see a screen that looks something like this. Notice that `DATABASE_URL` is already there, as Railway adds it automatically when you link the database.

    ```text
    +--------------------------------------------------------------------+
    | 📂 Roscos-crm / Variables                                          |
    +--------------------------------------------------------------------+
    |                                                                    |
    |   [+] New Variable                                                 |
    |                                                                    |
    |   +-----------------+--------------------------------------------+ |
    |   | Name            | Value                                      | |
    |   +-----------------+--------------------------------------------+ |
    |   | DATABASE_URL    | mysql://... (value injected by Railway)    | |
    |   +-----------------+--------------------------------------------+ |
    |                                                                    |
    +--------------------------------------------------------------------+
    ```

## Step 2: Add Each Variable One by One

You will now add the remaining required variables. For each variable, you will click the **[+] New Variable** button and fill in the **Name** and **Value** fields.

**Important:** The variable names are **case-sensitive** and must match exactly.

--- 

### 1. `JWT_SECRET`

This is a secret key for securing user sessions. It should be a long, random string.

*   **Name**: `JWT_SECRET`
*   **Value**: Generate a random string (at least 32 characters long). You can use a password generator for this.

    **Example:**
    ```text
    +---------------------------+--------------------------------------------------+
    | Name                      | Value                                            |
    +---------------------------+--------------------------------------------------+
    | JWT_SECRET                | aVeryLongAndRandomStringForSecurity_ChangeThis   |
    +---------------------------+--------------------------------------------------+
    ```

--- 

### 2. PayPal Credentials

These are your **Live** API credentials from your PayPal Developer account.

*   **Name**: `VITE_PAYPAL_CLIENT_ID`
*   **Value**: Your PayPal application's Client ID.

    **Example:**
    ```text
    +---------------------------+--------------------------------------------------+
    | Name                      | Value                                            |
    +---------------------------+--------------------------------------------------+
    | VITE_PAYPAL_CLIENT_ID     | AAbCDeFgHiJkLmNoPqRsTuVwXyZ_1234567890abcdefg    |
    +---------------------------+--------------------------------------------------+
    ```

*   **Name**: `VITE_PAYPAL_CLIENT_SECRET`
*   **Value**: Your PayPal application's Secret.

    **Example:**
    ```text
    +---------------------------+--------------------------------------------------+
    | Name                      | Value                                            |
    +---------------------------+--------------------------------------------------+
    | VITE_PAYPAL_CLIENT_SECRET | EHyz_aBcDeFgHiJkLmNoPqRsTuVwXyZ_1234567890abcdefg |
    +---------------------------+--------------------------------------------------+
    ```

--- 

### 3. Email Credentials

These are for sending email notifications via Gmail. You must use a **Google App Password**, not your regular account password.

*   **Name**: `EMAIL_USER`
*   **Value**: Your full Gmail address.

    **Example:**
    ```text
    +---------------------------+--------------------------------------------------+
    | Name                      | Value                                            |
    +---------------------------+--------------------------------------------------+
    | EMAIL_USER                | contact@roscosmoving.com                         |
    +---------------------------+--------------------------------------------------+
    ```

*   **Name**: `EMAIL_PASSWORD`
*   **Value**: The 16-character App Password you generated from your Google Account.

    **Example:**
    ```text
    +---------------------------+--------------------------------------------------+
    | Name                      | Value                                            |
    +---------------------------+--------------------------------------------------+
    | EMAIL_PASSWORD            | abcd efgh ijkl mnop                              |
    +---------------------------+--------------------------------------------------+
    ```

--- 

### 4. `NODE_ENV`

This tells the application to run in production mode.

*   **Name**: `NODE_ENV`
*   **Value**: `production`

    **Example:**
    ```text
    +---------------------------+--------------------------------------------------+
    | Name                      | Value                                            |
    +---------------------------+--------------------------------------------------+
    | NODE_ENV                  | production                                       |
    +---------------------------+--------------------------------------------------+
    ```

## Final Result

After you have added all the variables, your Railway variables screen should look like this:

```text
+--------------------------------------------------------------------+
| 📂 Roscos-crm / Variables                                          |
+--------------------------------------------------------------------+
|                                                                    |
|   [+] New Variable                                                 |
|                                                                    |
|   +---------------------------+----------------------------------+ |
|   | Name                      | Value                            | |
|   +---------------------------+----------------------------------+ |
|   | DATABASE_URL              | mysql://... (injected)           | |
|   | JWT_SECRET                | aVeryLongAndRandomStringFor...   | |
|   | VITE_PAYPAL_CLIENT_ID     | AAbCDeFgHiJkLmNoPqRsTuVwXy...    | |
|   | VITE_PAYPAL_CLIENT_SECRET | EHyz_aBcDeFgHiJkLmNoPqRsTu...    | |
|   | EMAIL_USER                | contact@roscosmoving.com         | |
|   | EMAIL_PASSWORD            | abcd efgh ijkl mnop              | |
|   | NODE_ENV                  | production                       | |
|   +---------------------------+----------------------------------+ |
|                                                                    |
+--------------------------------------------------------------------+
```

Every time you add or update a variable, Railway will automatically start a new deployment to apply the changes. Once the final variable is added and the deployment is successful, your application will be fully configured and ready to use.
