import { describe, it, expect } from "vitest";
import { calculateCycleSchedule } from "../src/services/group.service";
import { GroupFrequency } from "@ethioequb/shared";

describe("Cycle Schedule Calculation Engine (FR-003, AC-01)", () => {
  it("generates exactly 10 cycles for a 10-member weekly Equb dated 7 days apart", () => {
    const startDate = "2026-11-01T00:00:00.000Z";
    const totalCycles = 10;
    const schedule = calculateCycleSchedule(startDate, totalCycles, GroupFrequency.WEEKLY);

    expect(schedule).toHaveLength(10);
    expect(schedule[0].cycleNumber).toBe(1);
    expect(schedule[9].cycleNumber).toBe(10);

    // Verify 7-day delta between consecutive cycle due dates
    for (let i = 0; i < schedule.length - 1; i++) {
      const current = schedule[i].dueDate.getTime();
      const next = schedule[i + 1].dueDate.getTime();
      const diffDays = Math.round((next - current) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(7);
    }
  });

  it("generates daily cycles sequentially spaced 1 day apart", () => {
    const startDate = "2026-11-01T00:00:00.000Z";
    const schedule = calculateCycleSchedule(startDate, 5, GroupFrequency.DAILY);

    expect(schedule).toHaveLength(5);
    for (let i = 0; i < schedule.length - 1; i++) {
      const current = schedule[i].dueDate.getTime();
      const next = schedule[i + 1].dueDate.getTime();
      const diffDays = Math.round((next - current) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(1);
    }
  });
});
