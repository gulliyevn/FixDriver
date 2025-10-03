import { useCallback, useState, useMemo } from "react";
import AddressService from "../../services/addressService";

interface Coordinates {
  latitude: number;
  longitude: number;
}

type Status = "idle" | "loading" | "success" | "error";

export const useAddressGeocoding = (addressService?: AddressService) => {
  const serviceRef = useMemo(
    () => addressService ?? new AddressService(),
    [addressService],
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const geocodeFromCoordinates = useCallback(
    async (coordinates: Coordinates) => {
      setStatus("loading");
      setError(null);

      try {
        const response = await serviceRef.reverseGeocode(
          coordinates.latitude,
          coordinates.longitude,
        );
        if (response.success && response.data) {
          setStatus("success");
          return response.data.formattedAddress || response.data.address;
        }

        setStatus("error");
        setError(response.error || "address.errors.notFound");
        return null;
      } catch (err) {
        setStatus("error");
        setError("address.errors.fetchFailed");
        return null;
      }
    },
    [serviceRef],
  );

  const verifyAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) {
        return false;
      }

      return serviceRef.verifyAddress(address);
    },
    [serviceRef],
  );

  return {
    status,
    error,
    geocodeFromCoordinates,
    verifyAddress,
  };
};
