import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useVIPTimeTracking } from '../hooks/useVIPTimeTracking';

// Ключ, используемый в хуке
const VIP_TIME_KEY = '@driver_vip_time_tracking';

// Моки
jest.mock('@react-native-async-storage/async-storage', () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('../../../../context/BalanceContext', () => ({
	useBalanceContext: () => ({ addEarnings: jest.fn() }),
}));

describe('useVIPTimeTracking - 360-day auto reset', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('resets VIP cycle fully after 360 days from vipCycleStartDate', async () => {
		const now = new Date();
		const old = new Date(now);
		old.setDate(old.getDate() - 365);

		const initialVIPData = {
			currentDay: now.toISOString().split('T')[0],
			currentMonth: now.toISOString().slice(0, 7),
			hoursOnline: 0,
			ridesToday: 0,
			qualifiedDaysThisMonth: 15,
			consecutiveQualifiedMonths: 5,
			lastOnlineTime: null,
			isCurrentlyOnline: false,
			vipCycleStartDate: old.toISOString().split('T')[0],
			periodStartDate: now.toISOString().split('T')[0],
			qualifiedDaysHistory: [25, 22, 20, 18, 21],
		};
		(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(initialVIPData));

		const { result } = renderHook(() => useVIPTimeTracking(true));

		// Ждём загрузки
		await act(async () => {
			await new Promise((r) => setTimeout(r, 0));
		});

		// Форсируем дневную проверку
		await act(async () => {
			(result.current as any).forceDayCheck();
		});

		// Проверяем полный сброс по состоянию
		const data = (result.current as any).vipTimeData;
		expect(data.consecutiveQualifiedMonths).toBe(0);
		expect(data.vipCycleStartDate).toBeNull();
		expect(data.qualifiedDaysHistory).toEqual([]);
		expect(data.qualifiedDaysThisMonth).toBe(0);
		expect(typeof data.periodStartDate).toBe('string');
	});

	it('does not reset VIP cycle if less than 360 days passed', async () => {
		const now = new Date();
		const recent = new Date(now);
		recent.setDate(recent.getDate() - 30);

		const initialVIPData = {
			currentDay: now.toISOString().split('T')[0],
			currentMonth: now.toISOString().slice(0, 7),
			hoursOnline: 0,
			ridesToday: 0,
			qualifiedDaysThisMonth: 15,
			consecutiveQualifiedMonths: 3,
			lastOnlineTime: null,
			isCurrentlyOnline: false,
			vipCycleStartDate: recent.toISOString().split('T')[0],
			periodStartDate: now.toISOString().split('T')[0],
			qualifiedDaysHistory: [25, 22, 20],
		};
		(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(initialVIPData));

		const { result } = renderHook(() => useVIPTimeTracking(true));

		await act(async () => {
			await new Promise((r) => setTimeout(r, 0));
		});

		await act(async () => {
			(result.current as any).forceDayCheck();
		});

		const data = (result.current as any).vipTimeData;
		expect(data.consecutiveQualifiedMonths).toBe(3);
		expect(data.vipCycleStartDate).toBe(initialVIPData.vipCycleStartDate);
		expect(data.qualifiedDaysHistory).toEqual([25, 22, 20]);
		expect(data.qualifiedDaysThisMonth).toBe(15);
	});
});
