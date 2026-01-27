import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("Quote Calculator", () => {
  it("should calculate a quote with valid inputs", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });

    const result = await caller.quote.calculate({
      originZip: "10001",
      destinationZip: "90210",
      homeSize: "2bed",
    });

    expect(result).toBeDefined();
    expect(parseFloat(result.totalCost)).toBeGreaterThan(0);
    expect(parseFloat(result.baseCost)).toBeGreaterThan(0);
    expect(parseFloat(result.distanceCost)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(result.laborCost)).toBeGreaterThan(0);
    expect(parseFloat(result.estimatedDistance)).toBeGreaterThan(0);
  });

  it("should calculate different prices for different home sizes", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });

    const studio = await caller.quote.calculate({
      originZip: "10001",
      destinationZip: "90210",
      homeSize: "studio",
    });

    const fiveBed = await caller.quote.calculate({
      originZip: "10001",
      destinationZip: "90210",
      homeSize: "5bed_plus",
    });

    expect(parseFloat(fiveBed.totalCost)).toBeGreaterThan(parseFloat(studio.totalCost));
  });

  it("should handle different ZIP code distances", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });

    const shortDistance = await caller.quote.calculate({
      originZip: "10001",
      destinationZip: "10002",
      homeSize: "2bed",
    });

    const longDistance = await caller.quote.calculate({
      originZip: "10001",
      destinationZip: "90210",
      homeSize: "2bed",
    });

    expect(parseFloat(longDistance.totalCost)).toBeGreaterThan(parseFloat(shortDistance.totalCost));
  });
});

describe("Lead Creation", () => {
  it("should create a lead with valid inventory data", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });

    const result = await caller.lead.create({
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "(555) 123-4567",
      moveDate: new Date("2026-03-15"),
      originZip: "10001",
      destinationZip: "90210",
      homeSize: "2bed",
      inventory: {
        rooms: {
          "Living Room": ["Sofa", "Coffee Table"],
          "Master Bedroom": ["Bed Frame (King)", "Nightstands"],
        },
        appliances: ["Washer", "Dryer"],
        specialItems: ["Piano"],
      },
    });

    expect(result.success).toBe(true);
  });

  it("should create a lead with minimal inventory", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as any, res: {} as any });

    const result = await caller.lead.create({
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "(555) 987-6543",
      moveDate: new Date("2026-04-20"),
      originZip: "90210",
      destinationZip: "60601",
      homeSize: "1bed",
      inventory: {
        rooms: {},
        appliances: [],
        specialItems: [],
      },
    });

    expect(result.success).toBe(true);
  });
});
