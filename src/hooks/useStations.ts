import { useEffect, useMemo, useState } from "react";
import type { Stations } from "../types/types";

export const useStations = () => {
  const [stations, setStations] = useState<Stations>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //-------------------------------------------------------
  const fetchStations = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stations`);
      const data = await response.json();

      if (!response.ok) {
        setError("Failed to fetch stations");
      } else {
        setStations(data);
      }
    } catch (error) {
      console.error("Error fetching active stations:", error);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------------------------
  useEffect(() => {
    fetchStations();
  }, []);

  //-------------------------------------------------------
  const value = useMemo(
    () => ({
      stations,
      loading,
      error,
    }),
    [stations, loading, error]
  );

  return value;
};
