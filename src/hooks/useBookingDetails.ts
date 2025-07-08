import { useEffect, useMemo, useState } from "react";
import type { Booking } from "../types/types";

export const useBookingDetails = (bookingId: string, stationId: string) => {
  const [bookingDetails, setBookingDetails] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //-------------------------------------------------------
  const fetchBookingDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/stations/${stationId}/bookings/${bookingId}`);
      const data = await response.json();

      if (!response.ok) {
        setError("Failed to fetch bookingDetails");
      } else {
        setBookingDetails(data);
      }
    } catch (error) {
      console.error("Error fetching active bookingDetails:", error);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------------------------
  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId, stationId]);

  //-------------------------------------------------------
  const value = useMemo(
    () => ({
      bookingDetails,
      loading,
      error,
    }),
    [bookingDetails, loading, error]
  );

  return value;
};
