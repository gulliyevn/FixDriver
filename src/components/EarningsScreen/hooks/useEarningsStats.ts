import { useMemo } from "react";
import { EarningsStats, StatsCard } from "../types/earningsStats.types";

export const useEarningsStats = (
  period: "today" | "week" | "month" | "year",
) => {
  // Моковые данные - в реальном приложении будут приходить с API
  const mockStats: EarningsStats = useMemo(() => {
    const baseStats = {
      totalRides: 0,
      avgRating: 0,
      workHours: 0,
      completionRate: 0,
      avgPerRide: 0,
      totalHours: 0,
      scheduleCompletion: 0,
    };

    switch (period) {
      case "today":
        return {
          ...baseStats,
          totalRides: 8,
          avgRating: 4.8,
          workHours: 6.5,
          completionRate: 95,
          avgPerRide: 12.5,
          totalHours: 6.5,
          scheduleCompletion: 100,
        };
      case "week":
        return {
          ...baseStats,
          totalRides: 42,
          avgRating: 4.7,
          workHours: 38,
          completionRate: 92,
          avgPerRide: 11.8,
          totalHours: 38,
          scheduleCompletion: 95,
        };
      case "month":
        return {
          ...baseStats,
          totalRides: 156,
          avgRating: 4.6,
          workHours: 142,
          completionRate: 89,
          avgPerRide: 11.2,
          totalHours: 142,
          scheduleCompletion: 88,
        };
      case "year":
        return {
          ...baseStats,
          totalRides: 1847,
          avgRating: 4.5,
          workHours: 1680,
          completionRate: 87,
          avgPerRide: 10.8,
          totalHours: 1680,
          scheduleCompletion: 85,
        };
      default:
        return baseStats;
    }
  }, [period]);

  const statsCards: StatsCard[] = useMemo(
    () => [
      {
        title: "totalRides",
        value: mockStats.totalRides,
        icon: "car-outline",
        color: "#3B82F6",
        trend: { value: 12, isPositive: true },
      },
      {
        title: "avgRating",
        value: mockStats.avgRating.toFixed(1),
        subtitle: "/5.0",
        icon: "star-outline",
        color: "#F59E0B",
        trend: { value: 0.2, isPositive: true },
      },
      {
        title: "workHours",
        value: mockStats.workHours.toFixed(1),
        icon: "time-outline",
        color: "#10B981",
        trend: { value: 1.5, isPositive: true },
      },
      {
        title: "avgPerRide",
        value: `${mockStats.avgPerRide.toFixed(1)} AFc`,
        icon: "wallet-outline",
        color: "#EF4444",
        trend: { value: 0.8, isPositive: true },
      },
    ],
    [mockStats],
  );

  return {
    stats: mockStats,
    statsCards,
  };
};
