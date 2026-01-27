import { notifyOwner } from "./_core/notification";

export async function sendQuoteNotificationEmail(quoteData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  moveDate: Date;
  originZip: string;
  destinationZip: string;
  homeSize: string;
  inventory: any;
  estimatedQuote?: {
    totalCost: string;
    baseCost: string;
    distanceCost: string;
    laborCost: string;
    estimatedDistance: string;
  };
}) {
  try {
    // Format inventory for display
    const inventoryText = formatInventoryForEmail(quoteData.inventory);

    // Send notification to owner
    const result = await notifyOwner({
      title: `New Quote Request from ${quoteData.customerName}`,
      content: `
New Quote Request Received

Customer Information:
- Name: ${quoteData.customerName}
- Email: ${quoteData.customerEmail}
- Phone: ${quoteData.customerPhone}

Move Details:
- Move Date: ${new Date(quoteData.moveDate).toLocaleDateString()}
- From: ZIP ${quoteData.originZip}
- To: ZIP ${quoteData.destinationZip}
- Home Size: ${quoteData.homeSize}

Inventory Summary:
${inventoryText}

${
  quoteData.estimatedQuote
    ? `
Estimated Quote:
- Base Cost: $${quoteData.estimatedQuote.baseCost}
- Distance (${quoteData.estimatedQuote.estimatedDistance} mi): $${quoteData.estimatedQuote.distanceCost}
- Labor: $${quoteData.estimatedQuote.laborCost}
- Total Estimate: $${quoteData.estimatedQuote.totalCost}

Note: This is an estimate. Review and contact customer with final quote.
`
    : "Awaiting manual review for final quote."
}

Action Required: Review this quote request and contact the customer with your final quote.
      `,
    });

    return result;
  } catch (error) {
    console.error("Failed to send quote notification:", error);
    throw error;
  }
}

function formatInventoryForEmail(inventory: any): string {
  if (!inventory) return "No inventory details provided";

  let text = "";

  if (inventory.rooms && Object.keys(inventory.rooms).length > 0) {
    text += "Rooms & Items:\n";
    Object.entries(inventory.rooms).forEach(([room, items]: [string, any]) => {
      if (items.length > 0) {
        text += `  ${room}: ${items.join(", ")}\n`;
      }
    });
  }

  if (inventory.appliances && inventory.appliances.length > 0) {
    text += `\nAppliances: ${inventory.appliances.join(", ")}\n`;
  }

  if (inventory.specialItems && inventory.specialItems.length > 0) {
    text += `\nSpecial Items: ${inventory.specialItems.join(", ")}\n`;
  }

  return text || "No items selected";
}
