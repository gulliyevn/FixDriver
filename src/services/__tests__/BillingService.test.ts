import AsyncStorage from "@react-native-async-storage/async-storage";
import BillingService from "../../services/BillingService";

jest.useFakeTimers();

describe("BillingService", () => {
  beforeEach(async () => {
    await BillingService.clearRecords();
    // reset live
    const live = await BillingService.getLiveState();
    if (live.isWaitingActive) await BillingService.stopWaiting();
    if (live.isEmergencyActive) await BillingService.stopEmergency();
  });

  it("waiting: first 5 minutes free, then 0.01 AFc per second", async () => {
    await BillingService.startWaiting();
    // emulate time: 5 min + 10 seconds
    const start = Date.now();
    jest.setSystemTime(start);
    await BillingService.startWaiting();
    jest.setSystemTime(start + (5 * 60 + 10) * 1000);
    const record = await BillingService.stopWaiting();
    expect(record).not.toBeNull();
    expect(record!.type).toBe("waiting");
    expect(record!.chargedSeconds).toBe(10);
    expect(record!.amountAFc).toBeCloseTo(0.1, 2);
  });

  it("emergency: all seconds are paid at 0.01 AFc per second", async () => {
    await BillingService.startEmergency();
    const start = Date.now();
    jest.setSystemTime(start);
    await BillingService.startEmergency();
    jest.setSystemTime(start + 12 * 1000);
    const record = await BillingService.stopEmergency();
    expect(record).not.toBeNull();
    expect(record!.type).toBe("emergency");
    expect(record!.chargedSeconds).toBe(12);
    expect(record!.amountAFc).toBeCloseTo(0.12, 2);
  });
});
