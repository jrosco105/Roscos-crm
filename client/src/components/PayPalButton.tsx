import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  depositPercentage: number;
  customerEmail: string;
  quoteId: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export function PayPalButton({
  amount,
  depositPercentage,
  customerEmail,
  quoteId,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const depositAmount = (amount * depositPercentage) / 100;

  useEffect(() => {
    // Load PayPal SDK dynamically
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    script.async = true;

    script.onload = () => {
      if (window.paypal && containerRef.current) {
        window.paypal
          .Buttons({
            createOrder: async (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: depositAmount.toFixed(2),
                    },
                    description: `Deposit for Moving Quote #${quoteId}`,
                    custom_id: quoteId,
                  },
                ],
                payer: {
                  email_address: customerEmail,
                },
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const details = await actions.order.capture();
                onSuccess(details.id);
                toast.success("Payment successful!");
              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : "Payment failed";
                onError(errorMsg);
                toast.error(errorMsg);
              }
            },
            onError: (err: any) => {
              const errorMsg = err?.message || "An error occurred during payment";
              onError(errorMsg);
              toast.error(errorMsg);
            },
          })
          .render(containerRef.current);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [depositAmount, customerEmail, quoteId, onSuccess, onError]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Deposit Amount: <span className="text-lg font-bold">${depositAmount.toFixed(2)}</span>
        <span className="text-xs text-gray-500 ml-2">({depositPercentage}% of quote)</span>
      </p>
      <div ref={containerRef} className="paypal-button-container" />
    </div>
  );
}

// Extend window to include paypal
declare global {
  interface Window {
    paypal?: any;
  }
}
