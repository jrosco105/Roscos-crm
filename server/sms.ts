import { ENV } from "./_core/env";

/**
 * Send SMS notification using Twilio
 * Requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER env vars
 */
export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  try {
    // Check if Twilio credentials are configured
    if (!ENV.twilioAccountSid || !ENV.twilioAuthToken || !ENV.twilioPhoneNumber) {
      console.warn("[SMS] Twilio not configured. SMS not sent.");
      return false;
    }

    // Format phone number (ensure it has country code)
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+1${phoneNumber.replace(/\D/g, "")}`;

    // Use Twilio API
    const auth = Buffer.from(`${ENV.twilioAccountSid}:${ENV.twilioAuthToken}`).toString("base64");

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${ENV.twilioAccountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: ENV.twilioPhoneNumber,
          To: formattedPhone,
          Body: message,
        }).toString(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[SMS] Twilio error:", error);
      return false;
    }

    console.log(`[SMS] Message sent to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error("[SMS] Failed to send SMS:", error);
    return false;
  }
}

/**
 * Send quote submission confirmation to customer
 */
export async function sendQuoteSubmissionSMS(customerPhone: string, customerName: string, quoteId: string): Promise<boolean> {
  const message = `Hi ${customerName}! We received your moving quote request. Our team will review it and contact you within 24 hours. Quote ID: ${quoteId}`;
  return sendSMS(customerPhone, message);
}

/**
 * Send quote response notification to customer
 */
export async function sendQuoteResponseSMS(
  customerPhone: string,
  customerName: string,
  quoteAmount: string,
  depositAmount: string
): Promise<boolean> {
  const message = `Hi ${customerName}! Your moving quote is ready: $${quoteAmount}. Deposit required: $${depositAmount}. Reply to confirm or call us for details.`;
  return sendSMS(customerPhone, message);
}

/**
 * Send job confirmation to customer
 */
export async function sendJobConfirmationSMS(customerPhone: string, customerName: string, moveDate: string): Promise<boolean> {
  const message = `Hi ${customerName}! Your move is confirmed for ${moveDate}. We'll send crew arrival time 24 hours before. Thank you for choosing Rosco's Moving!`;
  return sendSMS(customerPhone, message);
}

/**
 * Send crew arrival notification to customer
 */
export async function sendCrewArrivalSMS(customerPhone: string, crewLeadName: string, eta: string): Promise<boolean> {
  const message = `Hi! Our crew led by ${crewLeadName} is on the way. ETA: ${eta}. Thanks for your patience!`;
  return sendSMS(customerPhone, message);
}

/**
 * Send job completion notification to customer
 */
export async function sendJobCompletionSMS(customerPhone: string, customerName: string): Promise<boolean> {
  const message = `Hi ${customerName}! Your move is complete. Thank you for choosing Rosco's Moving! Please rate us on Google.`;
  return sendSMS(customerPhone, message);
}
