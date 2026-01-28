import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { sendQuoteNotificationEmail } from "./email";
import { sendQuoteSubmissionSMS } from "./sms";
import { TRPCError } from "@trpc/server";

// ============ VALIDATION SCHEMAS ============

const createLeadSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(10),
  moveDate: z.date(),
  originZip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  destinationZip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  homeSize: z.enum(["studio", "1bed", "2bed", "3bed", "4bed", "5bed_plus", "commercial"]),
  inventory: z.record(z.string(), z.any()).optional(),
});

const calculateQuoteSchema = z.object({
  originZip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  destinationZip: z.string().regex(/^\d{5}$/, "Invalid ZIP code"),
  homeSize: z.enum(["studio", "1bed", "2bed", "3bed", "4bed", "5bed_plus", "commercial"]),
  inventory: z.record(z.string(), z.any()).optional(),
});

const createJobSchema = z.object({
  leadId: z.number(),
  customerName: z.string(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string(),
  moveDate: z.date(),
  originZip: z.string(),
  destinationZip: z.string(),
  quotedPrice: z.number().or(z.string()),
  inventory: z.record(z.string(), z.any()).optional(),
});

const createQuoteSchema = z.object({
  leadId: z.number(),
  estimatedDistance: z.number().or(z.string()),
  estimatedCost: z.number().or(z.string()),
  baseCost: z.number().or(z.string()),
  distanceCost: z.number().or(z.string()),
  laborCost: z.number().or(z.string()),
  notes: z.string().optional(),
});

// ============ PAYPAL ROUTER (NEW & SECURE) ============

const paypalRouter = router({
  createOrder: publicProcedure
    .input(z.object({ amount: z.string().optional() }))
    .mutation(async ({ input }) => {
      try {
        // 1. Get credentials SECURELY from server environment
        // The browser NEVER sees 'PAYPAL_CLIENT_SECRET'
        const clientId = process.env.VITE_PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          console.error("Missing PayPal variables in Railway");
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Payment configuration missing",
          });
        }

        // 2. Get Access Token from PayPal
        // NOTE: Use "api-m.paypal.com" for Live (Production)
        const baseUrl = "https://api-m.sandbox.paypal.com"; 
        const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

        const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
          method: "POST",
          body: "grant_type=client_credentials",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to authenticate with PayPal");
        }

        const tokenData = await tokenResponse.json();

        // 3. Create the Order
        const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  // Default to 100.00 if no amount is passed (e.g. deposit)
                  value: input.amount || "100.00", 
                },
              },
            ],
          }),
        });

        if (!orderResponse.ok) {
          throw new Error("Failed to create PayPal order");
        }

        const orderData = await orderResponse.json();
        
        // Return only the order ID/Links to the client
        return orderData;

      } catch (error) {
        console.error("PayPal Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to initiate payment",
        });
      }
    }),
});

// ============ QUOTE CALCULATOR ROUTER (FIXED) ============

const quoteRouter = router({
  // Calculate a quote based on move details (public endpoint for website)
  calculate: publicProcedure
    .input(calculateQuoteSchema)
    .mutation(async ({ input }) => {
      try {
        // 1. Try to get pricing from DB, or use DEFAULTS if DB is empty
        let pricingRule = await db.getActivePricingRule().catch(() => null);
        
        // DEFAULT VALUES (Use these if no settings are found)
        const defaults = {
          baseCostPerMove: 150,     // $150 starting fee
          costPerMile: 2.50,        // $2.50 per mile
          costPerLaborHour: 60,     // $60 per hour per mover
          minimumCharge: 400        // $400 minimum job price
        };

        // Estimate distance (simplified - in production, use Google Maps API)
        const estimatedDistance = Math.random() * 50 + 10; // Random 10-60 miles for demo

        // 2. Calculate costs using DB rules OR Defaults
        const baseCost = pricingRule 
          ? parseFloat(pricingRule.baseCostPerMove.toString()) 
          : defaults.baseCostPerMove;

        const ratePerMile = pricingRule 
          ? parseFloat(pricingRule.costPerMile.toString()) 
          : defaults.costPerMile;

        const ratePerHour = pricingRule 
          ? parseFloat(pricingRule.costPerLaborHour.toString()) 
          : defaults.costPerLaborHour;

        const distanceCost = estimatedDistance * ratePerMile;
        
        // Estimate labor hours based on home size
        const laborHoursBySize: Record<string, number> = {
          studio: 3,
          "1bed": 4,
          "2bed": 6,
          "3bed": 8,
          "4bed": 10,
          "5bed_plus": 12,
          commercial: 12,
        };
        
        const laborHours = laborHoursBySize[input.homeSize] || 3;
        const laborCost = laborHours * ratePerHour;
        
        let totalCost = baseCost + distanceCost + laborCost;
        
        // Apply minimum charge
        const minCharge = pricingRule 
          ? parseFloat(pricingRule.minimumCharge?.toString() || "0") 
          : defaults.minimumCharge;

        totalCost = Math.max(totalCost, minCharge);

        return {
          estimatedDistance: estimatedDistance.toFixed(2),
          baseCost: baseCost.toFixed(2),
          distanceCost: distanceCost.toFixed(2),
          laborCost: laborCost.toFixed(2),
          totalCost: totalCost.toFixed(2),
        };
      } catch (error) {
        console.error("Quote calculation error:", error);
        // Fallback response so the user NEVER sees an error screen
        return {
          estimatedDistance: "0",
          baseCost: "0",
          distanceCost: "0",
          laborCost: "0",
          totalCost: "500.00", // Safe fallback price
        };
      }
    }),
});

// ============ LEAD MANAGEMENT ROUTER ============

const leadRouter = router({
  // Create a new lead from website form
  create: publicProcedure
    .input(createLeadSchema)
    .mutation(async ({ input }) => {
      try {
        await db.createLead({
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          moveDate: input.moveDate,
          originZip: input.originZip,
          destinationZip: input.destinationZip,
          homeSize: input.homeSize,
          inventory: input.inventory,
          status: "new",
        });

        // Send email notification to admin
        try {
          await sendQuoteNotificationEmail({
            customerName: input.customerName,
            customerEmail: input.customerEmail || "",
            customerPhone: input.customerPhone,
            moveDate: input.moveDate,
            originZip: input.originZip,
            destinationZip: input.destinationZip,
            homeSize: input.homeSize,
            inventory: input.inventory,
          });
        } catch (emailError) {
          console.error("Failed to send notification email:", emailError);
        }

        // Send SMS notification to customer
        try {
          await sendQuoteSubmissionSMS(input.customerPhone, input.customerName, `QUOTE-${Date.now()}`);
        } catch (smsError) {
          console.error("Failed to send SMS notification:", smsError);
        }

        return { success: true };
      } catch (error) {
        console.error("Lead creation error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create lead",
        });
      }
    }),

  // Get all leads (admin only)
  list: protectedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        return await db.getLeads(input?.status);
      } catch (error) {
        console.error("Lead list error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch leads",
        });
      }
    }),

  // Get a specific lead
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        const lead = await db.getLeadById(input);
        if (!lead) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
        }
        return lead;
      } catch (error) {
        console.error("Get lead error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch lead",
        });
      }
    }),

  // Update lead status
  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        await db.updateLeadStatus(input.id, input.status);
        return { success: true };
      } catch (error) {
        console.error("Update lead status error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update lead status",
        });
      }
    }),

  // Get quotes for a lead
  getQuotes: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        return await db.getQuotesByLeadId(input);
      } catch (error) {
        console.error("Get quotes error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch quotes",
        });
      }
    }),

  // Create a quote for a lead
  createQuote: protectedProcedure
    .input(createQuoteSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        await db.createQuote({
          leadId: input.leadId,
          estimatedDistance: String(input.estimatedDistance),
          estimatedCost: String(input.estimatedCost),
          baseCost: String(input.baseCost),
          distanceCost: String(input.distanceCost),
          laborCost: String(input.laborCost),
          notes: input.notes,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        // Update lead status to "quoted"
        await db.updateLeadStatus(input.leadId, "quoted");

        return { success: true };
      } catch (error) {
        console.error("Create quote error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create quote",
        });
      }
    }),
});

// ============ JOB MANAGEMENT ROUTER ============

const jobRouter = router({
  // Create a job from a lead
  create: protectedProcedure
    .input(createJobSchema)
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        await db.createJob({
          leadId: input.leadId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          moveDate: input.moveDate,
          originZip: input.originZip,
          destinationZip: input.destinationZip,
          quotedPrice: String(input.quotedPrice),
          inventory: input.inventory,
          status: "scheduled",
        });

        // Update lead status to "booked"
        await db.updateLeadStatus(input.leadId, "booked");

        return { success: true };
      } catch (error) {
        console.error("Create job error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create job",
        });
      }
    }),

  // Get all jobs
  list: protectedProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "crew") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        if (input?.status) {
          return await db.getJobsByStatus(input.status);
        }
        // Return all jobs ordered by move date
        return await db.getJobsByStatus("scheduled");
      } catch (error) {
        console.error("Job list error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch jobs",
        });
      }
    }),

  // Get a specific job
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      try {
        const job = await db.getJobById(input);
        if (!job) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }
        return job;
      } catch (error) {
        console.error("Get job error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch job",
        });
      }
    }),

  // Get jobs by date range (for calendar view)
  getByDateRange: protectedProcedure
    .input(z.object({ startDate: z.date(), endDate: z.date() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        return await db.getJobsByDateRange(input.startDate, input.endDate);
      } catch (error) {
        console.error("Get jobs by date range error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch jobs",
        });
      }
    }),

  // Update job status
  updateStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        await db.updateJobStatus(input.id, input.status);
        return { success: true };
      } catch (error) {
        console.error("Update job status error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update job status",
        });
      }
    }),

  // Assign crew to job
  assignCrew: protectedProcedure
    .input(z.object({ jobId: z.number(), crewIds: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        await db.assignCrewToJob(input.jobId, input.crewIds);
        return { success: true };
      } catch (error) {
        console.error("Assign crew error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assign crew",
        });
      }
    }),

  // Assign vehicles to job
  assignVehicles: protectedProcedure
    .input(z.object({ jobId: z.number(), vehicleIds: z.array(z.number()) }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        await db.assignVehiclesToJob(input.jobId, input.vehicleIds);
        return { success: true };
      } catch (error) {
        console.error("Assign vehicles error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to assign vehicles",
        });
      }
    }),
});

// ============ CREW MANAGEMENT ROUTER ============

const crewRouter = router({
  // Get all active crew members
  list: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      try {
        return await db.getActiveCrew();
      } catch (error) {
        console.error("Crew list error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch crew",
        });
      }
    }),

  // Get a specific crew member
  getById: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      try {
        const crewMember = await db.getCrewById(input);
        if (!crewMember) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Crew member not found" });
        }
        return crewMember;
