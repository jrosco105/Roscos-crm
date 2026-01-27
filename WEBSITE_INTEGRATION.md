# How to Add the Quote Form to Your Existing Website

## Quick Integration (5 minutes)

If you want to keep your current roscosmoving.com website and just add the quote calculator, follow these steps:

### Step 1: Get Your CRM URL

After deployment, you'll have a URL like:
- `https://your-crm-domain.com` (if using custom domain)
- `https://roscos-crm.railway.app` (if using Railway)
- `https://your-server.com` (if self-hosted)

### Step 2: Add Quote Form to Your Website

Find the page where you want the quote form (usually your homepage or a "Get Quote" page).

Add this HTML code:

```html
<!-- Quote Calculator Section -->
<section style="padding: 40px 20px; background-color: #f5f5f5;">
  <div style="max-width: 900px; margin: 0 auto;">
    <h2 style="text-align: center; margin-bottom: 30px; font-size: 28px;">
      Get Your Free Moving Quote
    </h2>
    
    <iframe 
      src="https://YOUR-CRM-URL.com/quote" 
      width="100%" 
      height="1200" 
      frameborder="0"
      style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
      title="Moving Quote Calculator"
    ></iframe>
  </div>
</section>
```

**Replace `https://YOUR-CRM-URL.com` with your actual CRM domain.**

### Step 3: Test It

1. Visit your website
2. Scroll to the quote form section
3. Fill out the form and submit
4. Check your email (contact@roscosmoving.com) for the quote request

---

## Advanced Integration (Using Your Website Builder)

### For WordPress

1. Go to **Pages** → Create/Edit page
2. Add a **Custom HTML** block
3. Paste the iframe code above
4. Update the URL
5. Publish

### For Wix

1. Go to **Editor**
2. Add an **Embed** element
3. Select **Embed a Web Address**
4. Paste the iframe code
5. Adjust height/width as needed
6. Publish

### For Squarespace

1. Go to **Pages**
2. Add a **Code** block
3. Paste the iframe code
4. Update the URL
5. Publish

### For Shopify

1. Go to **Online Store** → **Pages**
2. Create/Edit a page
3. Click **< > Code**
4. Paste the iframe code
5. Save

### For HTML/Custom Website

Simply add the code to the HTML file where you want the form to appear.

---

## Styling the Embedded Form

### Make it Responsive

```html
<div style="width: 100%; max-width: 800px; margin: 20px auto;">
  <iframe 
    src="https://YOUR-CRM-URL.com/quote" 
    width="100%" 
    height="1200" 
    frameborder="0"
    style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  ></iframe>
</div>
```

### Add Custom Styling

```html
<style>
  .quote-section {
    padding: 60px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    text-align: center;
  }
  
  .quote-section h2 {
    color: white;
    margin-bottom: 30px;
    font-size: 32px;
  }
  
  .quote-container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
</style>

<section class="quote-section">
  <h2>Get Your Free Moving Quote</h2>
  <div class="quote-container">
    <iframe 
      src="https://YOUR-CRM-URL.com/quote" 
      width="100%" 
      height="1200" 
      frameborder="0"
      style="border: none;"
    ></iframe>
  </div>
</section>
```

---

## What Happens When Customers Submit

1. **Customer fills out form** - Provides move details and inventory
2. **Instant quote shown** - System calculates estimated cost
3. **Email sent to you** - You receive all details at contact@roscosmoving.com
4. **Customer sees PayPal button** - They can pay 20% deposit immediately
5. **You review & respond** - Contact customer within 24 hours with final quote

---

## Email Notifications

When a customer submits a quote, you'll receive an email with:
- Customer name, phone, email
- Move date and locations
- Home size and inventory details
- Estimated quote amount
- Link to view in your admin dashboard

You can then:
1. Review the details
2. Adjust the quote if needed
3. Contact the customer to confirm
4. Schedule the move

---

## Admin Dashboard Access

After a customer submits a quote, you can:

1. Go to `https://YOUR-CRM-URL.com/dashboard`
2. View all pending quotes
3. See scheduled jobs
4. Track revenue
5. Manage crew assignments

---

## Troubleshooting

### Form Not Showing

- Check that the URL is correct (no typos)
- Ensure your CRM is deployed and running
- Try opening the URL directly in a browser first
- Check browser console for errors (F12 → Console tab)

### Form Too Small/Large

Adjust the `height="1200"` value:
- For shorter forms: `height="900"`
- For longer forms: `height="1500"`

### Styling Doesn't Match

The form uses its own styling. To match your website:
- Edit `client/src/index.css` in the CRM
- Update colors and fonts to match your brand
- Redeploy the CRM

### Emails Not Arriving

- Check your spam/junk folder
- Verify email address in Settings page
- Check CRM logs for email errors
- Ensure SMTP credentials are correct

---

## Next Steps

1. **Deploy your CRM** - Follow DEPLOYMENT_GUIDE.md
2. **Get your CRM URL** - Note the domain
3. **Add to your website** - Use the code above
4. **Configure Settings** - Set pricing, PayPal, company info
5. **Test the flow** - Submit a test quote
6. **Go live** - Announce to customers

---

## Need Help?

- Check DEPLOYMENT_GUIDE.md for deployment instructions
- Review the CRM README.md for technical details
- Test everything locally first before going live
- Keep backups of your database

Good luck! 🚚
