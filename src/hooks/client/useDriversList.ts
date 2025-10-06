import { useCallback, useEffect, useMemo, useState } from "react";
import { Driver } from "../../types/driver";
import DriverService from "../../services/DriverService";

export type UseDriversListResult = {
  drivers: Driver[];
  filteredDrivers: (Driver & { isFavorite?: boolean })[];
  favorites: Set<string>;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (driverId: string) => void;
  restoreFavorites: (ids: string[]) => void;
  loadMoreDrivers: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  removeDriver: (driverId: string) => void;
  removeDrivers: (ids: Set<string>) => void;
};

const ITEMS_PER_PAGE = 10;

export const useDriversList = (): UseDriversListResult => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedQuery(searchQuery.trim().toLowerCase()),
      200,
    );
    return () => clearTimeout(id);
  }, [searchQuery]);

  const loadDrivers = useCallback(async (pageNumber = 1, isRefresh = false) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
        setPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      const response = await DriverService.getDriversPaged({
        page: pageNumber,
        pageSize: ITEMS_PER_PAGE,
        search: debouncedQuery || undefined,
      });

      if (response.success && response.data) {
        const pageData = response.data.items;
        if (pageNumber === 1 || isRefresh) {
          setDrivers(pageData);
        } else {
          setDrivers((prev) => [...prev, ...pageData]);
        }
        const total = response.data.total ?? 0;
        const accumulated = pageNumber * ITEMS_PER_PAGE;
        setHasMore(accumulated < total);
        setPage(pageNumber);
      } else {
        // В случае ошибки не меняем список, только сбрасываем hasMore
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    loadDrivers(1, true);
  }, [loadDrivers]);

  const loadMoreDrivers = useCallback(async () => {
    if (!loadingMore && hasMore) {
      await loadDrivers(page + 1, false);
    }
  }, [hasMore, loadDrivers, loadingMore, page]);

  const handleRefresh = useCallback(async () => {
    await loadDrivers(1, true);
  }, [loadDrivers]);

  const filteredDrivers = useMemo(() => {
    const query = debouncedQuery;
    const list = !query
      ? drivers
      : drivers.filter((driver) => {
          const firstName = driver.first_name?.toLowerCase() ?? "";
          const lastName = driver.last_name?.toLowerCase() ?? "";
          const brand = driver.vehicle_brand?.toLowerCase() ?? "";
          const model = driver.vehicle_model?.toLowerCase() ?? "";
          return (
            firstName.includes(query) ||
            lastName.includes(query) ||
            brand.includes(query) ||
            model.includes(query)
          );
        });
    const sorted = [...list].sort((a, b) => {
      const aFav = favorites.has(a.id);
      const bFav = favorites.has(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return (b.rating ?? 0) - (a.rating ?? 0);
    });
    return sorted.map((driver) => ({
      ...driver,
      isFavorite: favorites.has(driver.id),
    }));
  }, [drivers, debouncedQuery, favorites]);

  const toggleFavorite = useCallback((driverId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(driverId)) next.delete(driverId);
      else next.add(driverId);
      return next;
    });
  }, []);

  const restoreFavorites = useCallback((ids: string[]) => {
    setFavorites(new Set(ids));
  }, []);

  const removeDriver = useCallback((driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== driverId));
  }, []);

  const removeDrivers = useCallback((ids: Set<string>) => {
    if (!ids || ids.size === 0) return;
    setDrivers((prev) => prev.filter((d) => !ids.has(d.id)));
  }, []);

  return {
    drivers,
    filteredDrivers,
    favorites,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    toggleFavorite,
    restoreFavorites,
    loadMoreDrivers,
    handleRefresh,
    removeDriver,
    removeDrivers,
  };
};

export default useDriversList;
