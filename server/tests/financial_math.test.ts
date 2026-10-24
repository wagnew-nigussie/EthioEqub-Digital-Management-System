import { describe, it, expect } from "vitest";
import { toMinorUnits, toMajorUnits, formatETB } from "@ethioequb/shared";

describe("Financial Precision & Minor Unit Arithmetic (BR-001)", () => {
  it("converts major units (ETB) to integer minor units (santim) accurately", () => {
    expect(toMinorUnits(100)).toBe(10000);
    expect(toMinorUnits(10.5)).toBe(1050);
    expect(toMinorUnits(0.99)).toBe(99);
    expect(toMinorUnits(5000)).toBe(500000);
  });

  it("converts minor units back to major units without floating-point inaccuracies", () => {
    expect(toMajorUnits(10000)).toBe(100);
    expect(toMajorUnits(1050)).toBe(10.5);
    expect(toMajorUnits(BigInt(500000))).toBe(5000);
  });

  it("formats Ethiopian Birr strings consistently", () => {
    expect(formatETB(1000000)).toBe("10,000.00 ETB");
    expect(formatETB(5000)).toBe("50.00 ETB");
    expect(formatETB(BigInt(4000000))).toBe("40,000.00 ETB");
  });

  it("safely accumulates integer sums avoiding standard IEEE-754 0.1 + 0.2 error", () => {
    // In IEEE-754 float: 0.1 + 0.2 = 0.30000000000000004
    // In minor units (10 + 20 = 30):
    const minorA = toMinorUnits(0.1);
    const minorB = toMinorUnits(0.2);
    const sum = minorA + minorB;
    expect(sum).toBe(30);
    expect(toMajorUnits(sum)).toBe(0.3);
  });
});
