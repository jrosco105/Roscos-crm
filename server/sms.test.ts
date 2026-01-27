import { describe, it, expect } from "vitest";
import { sendSMS, sendQuoteSubmissionSMS, sendQuoteResponseSMS, sendJobConfirmationSMS, sendCrewArrivalSMS, sendJobCompletionSMS } from "./sms";

describe("SMS Notifications", () => {
  it("should export sendSMS function", () => {
    expect(typeof sendSMS).toBe("function");
  });

  it("should export sendQuoteSubmissionSMS function", () => {
    expect(typeof sendQuoteSubmissionSMS).toBe("function");
  });

  it("should export sendQuoteResponseSMS function", () => {
    expect(typeof sendQuoteResponseSMS).toBe("function");
  });

  it("should export sendJobConfirmationSMS function", () => {
    expect(typeof sendJobConfirmationSMS).toBe("function");
  });

  it("should export sendCrewArrivalSMS function", () => {
    expect(typeof sendCrewArrivalSMS).toBe("function");
  });

  it("should export sendJobCompletionSMS function", () => {
    expect(typeof sendJobCompletionSMS).toBe("function");
  });

  it("sendSMS should return a promise that resolves to boolean", async () => {
    const result = await sendSMS("5551234567", "Test message");
    expect(typeof result).toBe("boolean");
  });

  it("sendQuoteSubmissionSMS should return a promise that resolves to boolean", async () => {
    const result = await sendQuoteSubmissionSMS("5551234567", "John Doe", "QUOTE-123");
    expect(typeof result).toBe("boolean");
  });

  it("sendQuoteResponseSMS should return a promise that resolves to boolean", async () => {
    const result = await sendQuoteResponseSMS("5551234567", "Jane Smith", "1500", "300");
    expect(typeof result).toBe("boolean");
  });

  it("sendJobConfirmationSMS should return a promise that resolves to boolean", async () => {
    const result = await sendJobConfirmationSMS("5551234567", "John Doe", "2026-02-01");
    expect(typeof result).toBe("boolean");
  });

  it("sendCrewArrivalSMS should return a promise that resolves to boolean", async () => {
    const result = await sendCrewArrivalSMS("5551234567", "Mike Johnson", "2:00 PM");
    expect(typeof result).toBe("boolean");
  });

  it("sendJobCompletionSMS should return a promise that resolves to boolean", async () => {
    const result = await sendJobCompletionSMS("5551234567", "John Doe");
    expect(typeof result).toBe("boolean");
  });
});
