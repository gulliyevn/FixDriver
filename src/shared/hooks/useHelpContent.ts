import { useCallback, useEffect, useMemo, useState } from "react";
import HelpService from "../../services/HelpService";
import { HelpContent, HelpSection } from "../types/help";

interface UseHelpContentResult {
  sections: HelpSection[];
  contact: HelpContent["contact"];
  loading: boolean;
  refreshing: boolean;
  errorKey: string | null;
  refresh: () => Promise<void>;
}

const DEFAULT_RESULT: UseHelpContentResult = {
  sections: [],
  contact: {
    whatsappNumber: "",
    messageKey: "",
  },
  loading: false,
  refreshing: false,
  errorKey: null,
  refresh: async () => undefined,
};

const useHelpContent = (): UseHelpContentResult => {
  const [content, setContent] = useState<HelpContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const loadContent = useCallback(async (force = false) => {
    try {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = force
        ? await HelpService.refreshHelpContent()
        : await HelpService.fetchHelpContent();

      setContent(result);
      setErrorKey(null);
    } catch (error) {
      setErrorKey("errors.helpContentLoadFailed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadContent(false);
  }, [loadContent]);

  const refresh = useCallback(async () => {
    await loadContent(true);
  }, [loadContent]);

  return useMemo(() => {
    return {
      sections: content?.sections ?? [],
      contact: content?.contact ?? DEFAULT_RESULT.contact,
      loading,
      refreshing,
      errorKey,
      refresh,
    };
  }, [content, loading, refreshing, errorKey, refresh]);
};

export default useHelpContent;
