import AsyncStorage from '@react-native-async-storage/async-storage';
import { BillingLiveState, BillingRecord, BillingSessionType } from '../types/billing';

// Pricing constants (AFc)
const PRICE_PER_SECOND_AFC = 0.01; // 0.01 AFc per second
const WAITING_FREE_SECONDS = 5 * 60; // first 5 minutes are free in waiting

const STORAGE_KEYS = {
	LIVE: '@billing_live_state',
	RECORDS: '@billing_records',
};

function nowMs(): number {
	return Date.now();
}

function toId(): string {
	return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function readLive(): Promise<BillingLiveState> {
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEYS.LIVE);
		if (raw) return JSON.parse(raw);
	} catch (_e) { void 0; }
	return {
		isWaitingActive: false,
		waitingStartedAt: null,
		isEmergencyActive: false,
		emergencyStartedAt: null,
	};
}

async function writeLive(state: BillingLiveState): Promise<void> {
	try { await AsyncStorage.setItem(STORAGE_KEYS.LIVE, JSON.stringify(state)); } catch (_e) { void 0; }
}

async function readRecords(): Promise<BillingRecord[]> {
	try {
		const raw = await AsyncStorage.getItem(STORAGE_KEYS.RECORDS);
		if (raw) return JSON.parse(raw);
	} catch (_e) { void 0; }
	return [];
}

async function writeRecords(records: BillingRecord[]): Promise<void> {
	try { await AsyncStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records)); } catch (_e) { void 0; }
}

function calculateAmount(type: BillingSessionType, startedAt: number, endedAt: number): { chargedSeconds: number; amountAFc: number } {
	const totalSeconds = Math.max(0, Math.floor((endedAt - startedAt) / 1000));
	if (type === 'waiting') {
		const billable = Math.max(0, totalSeconds - WAITING_FREE_SECONDS);
		return { chargedSeconds: billable, amountAFc: +(billable * PRICE_PER_SECOND_AFC).toFixed(2) };
	}
	// emergency: every second is paid
	const billable = totalSeconds;
	return { chargedSeconds: billable, amountAFc: +(billable * PRICE_PER_SECOND_AFC).toFixed(2) };
}

class BillingServiceImpl {
	// Waiting (status 2)
	async startWaiting(): Promise<void> {
		const live = await readLive();
		if (live.isWaitingActive) return;
		live.isWaitingActive = true;
		live.waitingStartedAt = nowMs();
		await writeLive(live);
	}

	async stopWaiting(): Promise<BillingRecord | null> {
		const live = await readLive();
		if (!live.isWaitingActive || !live.waitingStartedAt) return null;
		const endedAt = nowMs();
		const { chargedSeconds, amountAFc } = calculateAmount('waiting', live.waitingStartedAt, endedAt);
		const record: BillingRecord = {
			id: toId(),
			type: 'waiting',
			startedAt: live.waitingStartedAt,
			endedAt,
			chargedSeconds,
			amountAFc,
		};
		live.isWaitingActive = false;
		live.waitingStartedAt = null;
		await writeLive(live);
		const records = await readRecords();
		records.push(record);
		await writeRecords(records);
		return record;
	}

	// Emergency (status 4)
	async startEmergency(): Promise<void> {
		const live = await readLive();
		if (live.isEmergencyActive) return;
		live.isEmergencyActive = true;
		live.emergencyStartedAt = nowMs();
		await writeLive(live);
	}

	async stopEmergency(): Promise<BillingRecord | null> {
		const live = await readLive();
		if (!live.isEmergencyActive || !live.emergencyStartedAt) return null;
		const endedAt = nowMs();
		const { chargedSeconds, amountAFc } = calculateAmount('emergency', live.emergencyStartedAt, endedAt);
		const record: BillingRecord = {
			id: toId(),
			type: 'emergency',
			startedAt: live.emergencyStartedAt,
			endedAt,
			chargedSeconds,
			amountAFc,
		};
		live.isEmergencyActive = false;
		live.emergencyStartedAt = null;
		await writeLive(live);
		const records = await readRecords();
		records.push(record);
		await writeRecords(records);
		return record;
	}

	// Export for backend sync
	async getLiveState(): Promise<BillingLiveState> { return readLive(); }
	async getRecords(): Promise<BillingRecord[]> { return readRecords(); }
	async clearRecords(): Promise<void> { await writeRecords([]); }
}

export const BillingService = new BillingServiceImpl();
export default BillingService;


