import { MapService, MapLocation, DriverLocation } from "../MapService";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDriver, UserRole } from "../../types/user";

// Мокаем зависимости
jest.mock("expo-location");
jest.mock("@react-native-async-storage/async-storage");

const mockLocation = Location as jest.Mocked<typeof Location>;
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("MapService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Мокаем Intl.DateTimeFormat для тестирования getDefaultRegion
    Object.defineProperty(global, "Intl", {
      value: {
        DateTimeFormat: jest.fn().mockReturnValue({
          resolvedOptions: jest.fn().mockReturnValue({ locale: "ru-RU" }),
        }),
      },
      writable: true,
    });
  });

  describe("getDefaultRegion", () => {
    it("returns correct region for Russian locale", () => {
      // Мокаем русскую локаль
      Object.defineProperty(global, "Intl", {
        value: {
          DateTimeFormat: jest.fn().mockReturnValue({
            resolvedOptions: jest.fn().mockReturnValue({ locale: "ru-RU" }),
          }),
        },
        writable: true,
      });

      const region = (MapService as any).getDefaultRegion();
      expect(region).toEqual({
        lat: 55.7558,
        lng: 37.6176,
        name: "Москва, Россия",
      });
    });

    it("returns default region for unknown locale", () => {
      // Мокаем неизвестную локаль
      Object.defineProperty(global, "Intl", {
        value: {
          DateTimeFormat: jest.fn().mockReturnValue({
            resolvedOptions: jest.fn().mockReturnValue({ locale: "xx-XX" }),
          }),
        },
        writable: true,
      });

      const region = (MapService as any).getDefaultRegion();
      expect(region).toEqual({
        lat: 40.3777,
        lng: 49.892,
        name: "Баку, Азербайджан",
      });
    });
  });

  describe("cacheLocation", () => {
    it("caches location successfully", async () => {
      const testLocation: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
        address: "Test Address",
      };

      await (MapService as any).cacheLocation(testLocation);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        "cached_location",
        expect.stringContaining('"latitude":40.3777'),
      );
    });

    it("handles caching error gracefully", async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

      const testLocation: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
      };

      await expect(
        (MapService as any).cacheLocation(testLocation),
      ).resolves.not.toThrow();
    });
  });

  describe("getCachedLocation", () => {
    it("returns cached location when valid", async () => {
      const mockCachedData = {
        location: {
          latitude: 40.3777,
          longitude: 49.892,
          address: "Cached Address",
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        expiresAt: Date.now() + 300000, // 5 minutes from now
      };

      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(mockCachedData),
      );

      const result = await (MapService as any).getCachedLocation();

      expect(result).toEqual(mockCachedData.location);
    });

    it("returns null when cache is expired", async () => {
      const mockCachedData = {
        location: {
          latitude: 40.3777,
          longitude: 49.892,
          address: "Cached Address",
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        expiresAt: Date.now() - 1000, // Expired
      };

      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(mockCachedData),
      );

      const result = await (MapService as any).getCachedLocation();

      expect(result).toBeNull();
      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        "cached_location",
      );
    });

    it("returns null when no cache exists", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const result = await (MapService as any).getCachedLocation();

      expect(result).toBeNull();
    });

    it("handles cache parsing error gracefully", async () => {
      mockAsyncStorage.getItem.mockResolvedValue("invalid json");

      const result = await (MapService as any).getCachedLocation();

      expect(result).toBeNull();
    });
  });

  describe("getCurrentLocation", () => {
    it("returns cached location when available", async () => {
      const mockCachedLocation: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
        address: "Cached Address",
      };

      mockAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify({
          location: mockCachedLocation,
          timestamp: Date.now(),
          expiresAt: Date.now() + 300000,
        }),
      );

      const result = await MapService.getCurrentLocation();

      expect(result).toEqual(mockCachedLocation);
      expect(
        mockLocation.requestForegroundPermissionsAsync,
      ).not.toHaveBeenCalled();
    });

    it("requests location permission when no cache", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
      });
      mockLocation.getCurrentPositionAsync.mockResolvedValue({
        coords: {
          latitude: 40.3777,
          longitude: 49.892,
          altitude: null,
          accuracy: 10,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });

      const result = await MapService.getCurrentLocation();

      expect(mockLocation.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(mockLocation.getCurrentPositionAsync).toHaveBeenCalled();
      expect(result.latitude).toBe(40.3777);
      expect(result.longitude).toBe(49.892);
    });

    it("returns default region when permission denied", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "denied" as any,
      });

      const result = await MapService.getCurrentLocation();

      expect(result.latitude).toBe(55.7558); // Moscow coordinates
      expect(result.longitude).toBe(37.6176);
      expect(result.address).toBe("Москва, Россия");
    });

    it("handles location request error gracefully", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
      });
      mockLocation.getCurrentPositionAsync.mockRejectedValue(
        new Error("Location error"),
      );

      const result = await MapService.getCurrentLocation();

      expect(result.latitude).toBe(55.7558); // Default region
      expect(result.longitude).toBe(37.6176);
    });
  });

  describe("getNearbyDrivers", () => {
    it("returns nearby drivers successfully", async () => {
      const testLocation: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
      };

      const mockDrivers: DriverLocation[] = [
        {
          latitude: 40.3778,
          longitude: 49.8921,
          driver: {
            id: "1",
            name: "Test Driver",
            surname: "Test",
            email: "driver@test.com",
            phone: "+1234567890",
            role: UserRole.DRIVER,
            avatar: null,
            rating: 4.5,
            createdAt: "2024-01-01T00:00:00.000Z",
            address: "",
            vehicle: {
              model: "Toyota Camry",
              color: "White",
              licensePlate: "ABC123",
            },
          },
          isAvailable: true,
          rating: 4.5,
        },
      ];

      // Мокаем API вызов (если есть)
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockDrivers),
      });

      const result = await MapService.getNearbyDrivers(testLocation);

      expect(Array.isArray(result)).toBe(true);
    });

    it("handles API error gracefully", async () => {
      const testLocation: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
      };

      global.fetch = jest.fn().mockRejectedValue(new Error("API error"));

      const result = await MapService.getNearbyDrivers(testLocation);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("getRoute", () => {
    it("returns route between two locations", async () => {
      const from: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
      };

      const to: MapLocation = {
        latitude: 40.3778,
        longitude: 49.8921,
      };

      const mockRoute: MapLocation[] = [
        { latitude: 40.3777, longitude: 49.892 },
        { latitude: 40.3778, longitude: 49.8921 },
      ];

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockRoute),
      });

      const result = await MapService.getRoute(from, to);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("handles route API error gracefully", async () => {
      const from: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
      };

      const to: MapLocation = {
        latitude: 40.3778,
        longitude: 49.8921,
      };

      global.fetch = jest.fn().mockRejectedValue(new Error("Route API error"));

      const result = await MapService.getRoute(from, to);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe("geocodeAddress", () => {
    it("geocodes address successfully", async () => {
      const testAddress = "Test Address, Baku";
      const mockLocation: MapLocation = {
        latitude: 40.3777,
        longitude: 49.892,
        address: testAddress,
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockLocation),
      });

      const result = await MapService.geocodeAddress(testAddress);

      expect(result.latitude).toBe(40.3777);
      expect(result.longitude).toBe(49.892);
      expect(result.address).toBe(testAddress);
    });

    it("handles geocoding error gracefully", async () => {
      const testAddress = "Invalid Address";

      global.fetch = jest.fn().mockRejectedValue(new Error("Geocoding error"));

      const result = await MapService.geocodeAddress(testAddress);

      expect(result.latitude).toBe(55.7558); // Default region
      expect(result.longitude).toBe(37.6176);
    });
  });

  describe("watchLocation", () => {
    it("starts watching location and returns unsubscribe function", async () => {
      const mockCallback = jest.fn();
      const mockLocationSubscription = {
        remove: jest.fn(),
      };

      mockLocation.watchPositionAsync.mockResolvedValue(
        mockLocationSubscription,
      );

      const unsubscribe = await MapService.watchLocation(mockCallback);

      expect(typeof unsubscribe).toBe("function");
      expect(mockLocation.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(mockLocation.watchPositionAsync).toHaveBeenCalled();
    });

    it("handles permission denied for location watching", async () => {
      const mockCallback = jest.fn();

      mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "denied" as any,
      });

      const unsubscribe = await MapService.watchLocation(mockCallback);

      expect(typeof unsubscribe).toBe("function");
      expect(mockLocation.watchPositionAsync).not.toHaveBeenCalled();
    });
  });

  describe("getCurrentLocationWithRetry", () => {
    it("retries location request on failure", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
      });

      // Первые две попытки неудачные, третья успешная
      mockLocation.getCurrentPositionAsync
        .mockRejectedValueOnce(new Error("First attempt failed"))
        .mockRejectedValueOnce(new Error("Second attempt failed"))
        .mockResolvedValueOnce({
          coords: {
            latitude: 40.3777,
            longitude: 49.892,
            altitude: null,
            accuracy: 10,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });

      const result = await MapService.getCurrentLocationWithRetry(3);

      expect(mockLocation.getCurrentPositionAsync).toHaveBeenCalledTimes(3);
      expect(result.latitude).toBe(40.3777);
      expect(result.longitude).toBe(49.892);
    });

    it("returns default region after all retries fail", async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);
      mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
        status: "granted" as any,
      });
      mockLocation.getCurrentPositionAsync.mockRejectedValue(
        new Error("All attempts failed"),
      );

      const result = await MapService.getCurrentLocationWithRetry(2);

      expect(mockLocation.getCurrentPositionAsync).toHaveBeenCalledTimes(2);
      expect(result.latitude).toBe(55.7558); // Default region
      expect(result.longitude).toBe(37.6176);
    });
  });

  describe("clearLocationCache", () => {
    it("clears location cache successfully", async () => {
      await MapService.clearLocationCache();

      expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith(
        "cached_location",
      );
    });

    it("handles cache clearing error gracefully", async () => {
      mockAsyncStorage.removeItem.mockRejectedValue(new Error("Clear error"));

      await expect(MapService.clearLocationCache()).resolves.not.toThrow();
    });
  });
});
