import { useState, useEffect } from "react";
import {
  getCoachStats,
  getCourtStats,
  getIdentityStats,
} from "@/api/dashboardAPI";

export const useDashboardData = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalCourtOwners: 0,
    totalCoaches: 0,
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    revenueData: [],
    bookingTypeDate: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function mergeStats(coachStats, courtStats) {
      return coachStats.map((coachEntry) => {
        const matchingCourtEntry = courtStats.find((court) => {
          const courtMonth =
            new Date(court.data.date_range.start_date).getMonth() + 1; // Extract month (1-based)
          return courtMonth === coachEntry.month;
        });

        return {
          date: `2025-${String(coachEntry.month).padStart(2, "0")}-01`,
          courtRevenue: matchingCourtEntry
            ? matchingCourtEntry.data.total_courts_revenue
            : 0,
          coachRevenue: coachEntry.data.totalRevenue,
        };
      });
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const identityStats = await getIdentityStats();
        // CALL FROM JANUARY TO CURRENT MONTH
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const coachStatPerMonth = [];
        const courtStatsPerMonth = [];

        const courtStats = await getCourtStats();
        const coachStats = await getCoachStats(undefined, undefined, "year");

        for (let month = 1; month <= currentMonth; month++) {
          const startDate = `${currentYear}-${month
            .toString()
            .padStart(2, "0")}-01`;
          const endDate = new Date(currentYear, month, 0)
            .toISOString()
            .split("T")[0];
          const coachData = await getCoachStats(startDate, endDate, "month");
          const courtData = await getCourtStats(startDate, endDate);
          coachStatPerMonth.push({ month, data: coachData });
          courtStatsPerMonth.push({ month, data: courtData });
        }

        var mergeStat = mergeStats(coachStatPerMonth, courtStatsPerMonth);

        setData({
          totalUsers: identityStats.totalUsers,
          totalCourtOwners: identityStats.totalCourtOwners,
          totalCoaches: identityStats.totalCoaches,
          totalCourts: courtStats.total_courts,
          totalRevenue:
            parseFloat(courtStats.total_courts_revenue) +
            parseFloat(coachStats.totalRevenue),
          revenueData: mergeStat,
        });

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
