import DriverStatsService, { DayStats } from "../DriverStatsService";

describe("DriverStatsService", () => {
  beforeEach(() => {
    // Сбрасываем моковую БД перед каждым тестом
    DriverStatsService.resetMockDatabase();
  });

  describe("Сохранение статистики", () => {
    it("сохраняет статистику за день", async () => {
      const dayStats = {
        date: "2024-08-20",
        hoursOnline: 8.5,
        ridesCount: 12,
        earnings: 45.5,
        isQualified: true,
      };

      await DriverStatsService.saveDayStats(dayStats);

      const savedStats = await DriverStatsService.getDayStats("2024-08-20");
      expect(savedStats).toEqual({
        ...dayStats,
        timestamp: expect.any(Number),
      });
    });

    it("перезаписывает статистику за тот же день", async () => {
      const dayStats1 = {
        date: "2024-08-20",
        hoursOnline: 8.5,
        ridesCount: 12,
        earnings: 45.5,
        isQualified: true,
      };

      const dayStats2 = {
        date: "2024-08-20",
        hoursOnline: 10.2,
        ridesCount: 15,
        earnings: 58.3,
        isQualified: true,
      };

      await DriverStatsService.saveDayStats(dayStats1);
      await DriverStatsService.saveDayStats(dayStats2);

      const savedStats = await DriverStatsService.getDayStats("2024-08-20");
      expect(savedStats).toEqual({
        ...dayStats2,
        timestamp: expect.any(Number),
      });
    });
  });

  describe("Получение статистики за период", () => {
    beforeEach(async () => {
      // Заполняем тестовыми данными
      await DriverStatsService.populateTestData();
    });

    it("получает статистику за период", async () => {
      // Получаем актуальные даты из тестовых данных
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBeforeYesterday = new Date(today);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const startDate = threeDaysAgo.toISOString().split("T")[0];
      const endDate = yesterday.toISOString().split("T")[0];

      const periodStats = await DriverStatsService.getPeriodStats(
        startDate,
        endDate,
      );

      expect(periodStats).toEqual({
        totalHours: expect.closeTo(24.8, 1), // 8.5 + 6.2 + 10.1
        totalRides: 35, // 12 + 8 + 15
        totalEarnings: expect.closeTo(135.9, 1), // 45.5 + 32.1 + 58.3
        qualifiedDays: 2, // 2 дня квалифицированы
        averageHoursPerDay: expect.closeTo(8.27, 2), // 24.8 / 3
        averageRidesPerDay: expect.closeTo(11.67, 2), // 35 / 3
      });
    });

    it("возвращает нулевую статистику для пустого периода", async () => {
      const periodStats = await DriverStatsService.getPeriodStats(
        "2024-01-01",
        "2024-01-31",
      );

      expect(periodStats).toEqual({
        totalHours: 0,
        totalRides: 0,
        totalEarnings: 0,
        qualifiedDays: 0,
        averageHoursPerDay: 0,
        averageRidesPerDay: 0,
      });
    });
  });

  describe("Получение статистики за последние дни", () => {
    beforeEach(async () => {
      await DriverStatsService.populateTestData();
    });

    it("получает статистику за последние 3 дня", async () => {
      const lastNDaysStats = await DriverStatsService.getLastNDaysStats(3);

      expect(lastNDaysStats).toHaveLength(3);

      // Проверяем, что данные отсортированы по дате (новые сначала)
      const dates = lastNDaysStats.map((stat) => stat.date);
      expect(dates).toEqual(dates.sort().reverse());
    });

    it("возвращает пустой массив для несуществующих данных", async () => {
      DriverStatsService.resetMockDatabase();
      const lastNDaysStats = await DriverStatsService.getLastNDaysStats(5);

      expect(lastNDaysStats).toEqual([]);
    });
  });

  describe("Получение статистики за месяц", () => {
    beforeEach(async () => {
      await DriverStatsService.populateTestData();
    });

    it("получает статистику за текущий месяц", async () => {
      const monthStats = await DriverStatsService.getCurrentMonthStats();

      // Проверяем, что данные есть и все относятся к текущему месяцу
      expect(monthStats.length).toBeGreaterThan(0);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      expect(
        monthStats.every((stat) => stat.date.startsWith(currentMonth)),
      ).toBe(true);
    });
  });

  describe("Очистка старых данных", () => {
    it("очищает данные старше года", async () => {
      // Добавляем старые данные
      const oldStats: DayStats = {
        date: "2022-08-20",
        hoursOnline: 5.0,
        ridesCount: 8,
        earnings: 25.0,
        isQualified: false,
        timestamp: Date.now() - 2 * 365 * 24 * 60 * 60 * 1000, // 2 года назад
      };

      await DriverStatsService.saveDayStats(oldStats);

      // Добавляем новые данные
      const today = new Date().toISOString().split("T")[0];
      const newStats: DayStats = {
        date: today,
        hoursOnline: 8.5,
        ridesCount: 12,
        earnings: 45.5,
        isQualified: true,
        timestamp: Date.now(),
      };

      await DriverStatsService.saveDayStats(newStats);

      // Очищаем старые данные
      await DriverStatsService.cleanupOldData();

      // Проверяем, что старые данные удалены
      const oldData = await DriverStatsService.getDayStats("2022-08-20");
      expect(oldData).toBeNull();

      // Проверяем, что новые данные остались
      const newData = await DriverStatsService.getDayStats(today);
      expect(newData).not.toBeNull();
    });
  });

  describe("Работа с разными водителями", () => {
    it("изолирует данные разных водителей", async () => {
      const driver1Stats = {
        date: "2024-08-20",
        hoursOnline: 8.5,
        ridesCount: 12,
        earnings: 45.5,
        isQualified: true,
      };

      const driver2Stats = {
        date: "2024-08-20",
        hoursOnline: 6.2,
        ridesCount: 8,
        earnings: 32.1,
        isQualified: false,
      };

      // Сохраняем данные для первого водителя
      DriverStatsService.setDriverId("driver1");
      await DriverStatsService.saveDayStats(driver1Stats);

      // Сохраняем данные для второго водителя
      DriverStatsService.setDriverId("driver2");
      await DriverStatsService.saveDayStats(driver2Stats);

      // Проверяем, что данные изолированы
      DriverStatsService.setDriverId("driver1");
      const driver1Data = await DriverStatsService.getDayStats("2024-08-20");
      expect(driver1Data).toEqual({
        ...driver1Stats,
        timestamp: expect.any(Number),
      });

      DriverStatsService.setDriverId("driver2");
      const driver2Data = await DriverStatsService.getDayStats("2024-08-20");
      expect(driver2Data).toEqual({
        ...driver2Stats,
        timestamp: expect.any(Number),
      });
    });
  });
});
