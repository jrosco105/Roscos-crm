import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with additional tables for moving company CRM operations.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "crew"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table: tracks prospects from initial inquiry through booking
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  status: mysqlEnum("status", ["new", "quoted", "booked", "completed", "cancelled"]).default("new").notNull(),
  
  // Customer info
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  
  // Move details
  moveDate: timestamp("moveDate"),
  originZip: varchar("originZip", { length: 10 }).notNull(),
  destinationZip: varchar("destinationZip", { length: 10 }).notNull(),
  homeSize: mysqlEnum("homeSize", ["studio", "1bed", "2bed", "3bed", "4bed", "5bed_plus", "commercial"]).notNull(),
  
  // Inventory (stored as JSON for flexibility)
  inventory: json("inventory"),
  
  // Quote info
  estimatedDistance: decimal("estimatedDistance", { precision: 10, scale: 2 }),
  estimatedCost: decimal("estimatedCost", { precision: 10, scale: 2 }),
  quoteNotes: text("quoteNotes"),
  
  // Tracking
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  quotedAt: timestamp("quotedAt"),
  bookedAt: timestamp("bookedAt"),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Jobs table: represents confirmed moving jobs
 */
export const jobs = mysqlTable("jobs", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled").notNull(),
  
  // Customer info
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  
  // Move details
  moveDate: timestamp("moveDate").notNull(),
  originZip: varchar("originZip", { length: 10 }).notNull(),
  destinationZip: varchar("destinationZip", { length: 10 }).notNull(),
  estimatedDistance: decimal("estimatedDistance", { precision: 10, scale: 2 }),
  
  // Inventory
  inventory: json("inventory"),
  
  // Pricing
  quotedPrice: decimal("quotedPrice", { precision: 10, scale: 2 }).notNull(),
  finalPrice: decimal("finalPrice", { precision: 10, scale: 2 }),
  
  // Crew & Vehicle assignments
  crewIds: json("crewIds"), // Array of user IDs assigned to this job
  vehicleIds: json("vehicleIds"), // Array of vehicle IDs assigned to this job
  
  // Tracking
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

/**
 * Quotes table: stores quote history for leads
 */
export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  
  estimatedDistance: decimal("estimatedDistance", { precision: 10, scale: 2 }).notNull(),
  estimatedCost: decimal("estimatedCost", { precision: 10, scale: 2 }).notNull(),
  
  // Breakdown for transparency
  baseCost: decimal("baseCost", { precision: 10, scale: 2 }).notNull(),
  distanceCost: decimal("distanceCost", { precision: 10, scale: 2 }).notNull(),
  laborCost: decimal("laborCost", { precision: 10, scale: 2 }).notNull(),
  
  notes: text("notes"),
  expiresAt: timestamp("expiresAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

/**
 * Invoices table: tracks billing for jobs
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "sent", "partially_paid", "paid", "overdue", "cancelled"]).default("draft").notNull(),
  
  // Amounts
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Payments
  depositAmount: decimal("depositAmount", { precision: 10, scale: 2 }).default("0"),
  depositPaid: boolean("depositPaid").default(false),
  finalAmount: decimal("finalAmount", { precision: 10, scale: 2 }).default("0"),
  finalPaid: boolean("finalPaid").default(false),
  
  // Payment details
  paymentMethod: mysqlEnum("paymentMethod", ["paypal", "cash", "check", "credit_card"]),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }),
  
  // Dates
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  dueAt: timestamp("dueAt"),
  paidAt: timestamp("paidAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Crew table: represents moving crew members
 */
export const crew = mysqlTable("crew", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  
  status: mysqlEnum("status", ["active", "inactive", "on_leave"]).default("active").notNull(),
  
  // Availability
  availableFrom: timestamp("availableFrom"),
  availableTo: timestamp("availableTo"),
  
  // Skills/certifications
  certifications: json("certifications"), // Array of certifications
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Crew = typeof crew.$inferSelect;
export type InsertCrew = typeof crew.$inferInsert;

/**
 * Vehicles table: tracks company vehicles
 */
export const vehicles = mysqlTable("vehicles", {
  id: int("id").autoincrement().primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  licensePlate: varchar("licensePlate", { length: 20 }).notNull().unique(),
  
  type: mysqlEnum("type", ["box_truck", "moving_van", "pickup", "cargo_van"]).notNull(),
  capacity: varchar("capacity", { length: 100 }), // e.g., "10,000 lbs"
  
  status: mysqlEnum("status", ["active", "maintenance", "retired"]).default("active").notNull(),
  
  // Availability
  availableFrom: timestamp("availableFrom"),
  availableTo: timestamp("availableTo"),
  
  // Maintenance info
  lastServiceDate: timestamp("lastServiceDate"),
  nextServiceDate: timestamp("nextServiceDate"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = typeof vehicles.$inferInsert;

/**
 * Pricing rules table: stores company pricing configuration
 */
export const pricingRules = mysqlTable("pricingRules", {
  id: int("id").autoincrement().primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Base pricing
  baseCostPerMove: decimal("baseCostPerMove", { precision: 10, scale: 2 }).notNull(),
  costPerMile: decimal("costPerMile", { precision: 10, scale: 2 }).notNull(),
  costPerLaborHour: decimal("costPerLaborHour", { precision: 10, scale: 2 }).notNull(),
  
  // Modifiers
  minimumCharge: decimal("minimumCharge", { precision: 10, scale: 2 }),
  weekendSurcharge: decimal("weekendSurcharge", { precision: 5, scale: 2 }), // Percentage
  
  isActive: boolean("isActive").default(true),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingRule = typeof pricingRules.$inferSelect;
export type InsertPricingRule = typeof pricingRules.$inferInsert;

/**
 * Bill of Lading table: digital BOL documents
 */
export const billsOfLading = mysqlTable("billsOfLading", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  
  bolNumber: varchar("bolNumber", { length: 50 }).notNull().unique(),
  
  // Items listed on BOL
  items: json("items").notNull(), // Array of inventory items
  
  // Signatures
  customerSignature: text("customerSignature"), // Base64 encoded signature
  crewSignatureIds: json("crewSignatureIds"), // Array of crew member IDs who signed
  
  status: mysqlEnum("status", ["draft", "signed", "completed"]).default("draft").notNull(),
  
  // Damage/notes
  damageNotes: text("damageNotes"),
  specialNotes: text("specialNotes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  signedAt: timestamp("signedAt"),
});

export type BillOfLading = typeof billsOfLading.$inferSelect;
export type InsertBillOfLading = typeof billsOfLading.$inferInsert;

/**
 * Notifications log: tracks sent notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  
  recipientId: int("recipientId"),
  recipientEmail: varchar("recipientEmail", { length: 320 }),
  recipientPhone: varchar("recipientPhone", { length: 20 }),
  
  type: mysqlEnum("type", ["email", "sms", "in_app"]).notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  
  relatedJobId: int("relatedJobId"),
  relatedLeadId: int("relatedLeadId"),
  
  status: mysqlEnum("status", ["pending", "sent", "failed"]).default("pending").notNull(),
  errorMessage: text("errorMessage"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
