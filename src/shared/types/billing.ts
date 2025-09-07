/**
 * Billing domain types
 */

/**
 * Allowed billing session types.
 */
export type BillingSessionType = 'waiting' | 'emergency';

/**
 * Single billing session record.
 */
export interface BillingRecord {
	// A unique identifier for the session record (generated locally)
	id: string;
	type: BillingSessionType;
	startedAt: number; // epoch ms
	endedAt: number;   // epoch ms
	chargedSeconds: number; // seconds that were charged (after free window if any)
	amountAFc: number; // charged amount in AFc
}

/**
 * Current live billing state flags and timestamps.
 */
export interface BillingLiveState {
	isWaitingActive: boolean;
	waitingStartedAt: number | null;
	isEmergencyActive: boolean;
	emergencyStartedAt: number | null;
}


