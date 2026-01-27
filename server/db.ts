import { eq, and, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, jobs, quotes, invoices, crew, vehicles, pricingRules, billsOfLading, notifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ LEAD QUERIES ============

export async function createLead(lead: typeof leads.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(leads).values(lead);
  return result;
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getLeads(status?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (status) {
    return db.select().from(leads).where(eq(leads.status, status as any)).orderBy(desc(leads.createdAt));
  }
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export async function updateLeadStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (status === "quoted") {
    updateData.quotedAt = new Date();
  } else if (status === "booked") {
    updateData.bookedAt = new Date();
  }
  
  return db.update(leads).set(updateData).where(eq(leads.id, id));
}

// ============ QUOTE QUERIES ============

export async function createQuote(quote: typeof quotes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(quotes).values(quote);
  return result;
}

export async function getQuotesByLeadId(leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(quotes).where(eq(quotes.leadId, leadId)).orderBy(desc(quotes.createdAt));
}

// ============ JOB QUERIES ============

export async function createJob(job: typeof jobs.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(jobs).values(job);
  return result;
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getJobsByStatus(status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(jobs).where(eq(jobs.status, status as any)).orderBy(desc(jobs.moveDate));
}

export async function getJobsByDateRange(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(jobs).where(
    and(
      gte(jobs.moveDate, startDate),
      lte(jobs.moveDate, endDate)
    )
  ).orderBy(jobs.moveDate);
}

export async function updateJobStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (status === "completed") {
    updateData.completedAt = new Date();
  }
  
  return db.update(jobs).set(updateData).where(eq(jobs.id, id));
}

export async function assignCrewToJob(jobId: number, crewIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(jobs).set({ crewIds }).where(eq(jobs.id, jobId));
}

export async function assignVehiclesToJob(jobId: number, vehicleIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(jobs).set({ vehicleIds }).where(eq(jobs.id, jobId));
}

// ============ INVOICE QUERIES ============

export async function createInvoice(invoice: typeof invoices.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(invoices).values(invoice);
  return result;
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getInvoicesByJobId(jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(invoices).where(eq(invoices.jobId, jobId));
}

export async function updateInvoiceStatus(id: number, status: string, paymentData?: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (paymentData) {
    Object.assign(updateData, paymentData);
  }
  
  return db.update(invoices).set(updateData).where(eq(invoices.id, id));
}

// ============ CREW QUERIES ============

export async function createCrew(crewMember: typeof crew.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(crew).values(crewMember);
  return result;
}

export async function getCrewById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(crew).where(eq(crew.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getActiveCrew() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(crew).where(eq(crew.status, "active"));
}

// ============ VEHICLE QUERIES ============

export async function createVehicle(vehicle: typeof vehicles.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(vehicles).values(vehicle);
  return result;
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getActiveVehicles() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(vehicles).where(eq(vehicles.status, "active"));
}

// ============ PRICING RULES QUERIES ============

export async function getPricingRules() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(pricingRules).where(eq(pricingRules.isActive, true));
}

export async function getActivePricingRule() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(pricingRules).where(eq(pricingRules.isActive, true)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// ============ BILL OF LADING QUERIES ============

export async function createBillOfLading(bol: typeof billsOfLading.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(billsOfLading).values(bol);
  return result;
}

export async function getBillOfLadingByJobId(jobId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(billsOfLading).where(eq(billsOfLading.jobId, jobId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateBillOfLading(id: number, updates: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(billsOfLading).set(updates).where(eq(billsOfLading.id, id));
}

// ============ NOTIFICATION QUERIES ============

export async function createNotification(notification: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getNotificationsByRecipient(recipientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(notifications).where(eq(notifications.recipientId, recipientId)).orderBy(desc(notifications.createdAt));
}

export async function updateNotificationStatus(id: number, status: string, errorMessage?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (status === "sent") {
    updateData.sentAt = new Date();
  }
  if (errorMessage) {
    updateData.errorMessage = errorMessage;
  }
  
  return db.update(notifications).set(updateData).where(eq(notifications.id, id));
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : null;
}
