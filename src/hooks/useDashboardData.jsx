import { useState, useEffect } from "react";
import {
  getCoachStats,
  getCourtStats,
  getIdentityStats,
  getPaymentStats,
} from "@/api/dashboardAPI";
import { set } from "date-fns";

export const mergeStatsByUnit = (coachStats, courtStats, unit) => {
  const getKey = (entry) => {
    const dateStr =
      entry?.data?.date_range?.start_date ||
      `2025-${String(entry.month).padStart(2, "0")}-01`;
    const date = new Date(dateStr);

    if (unit === "year") return `${date.getFullYear()}`;
    if (unit === "month")
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    return date.toISOString().split("T")[0];
  };

  const result = coachStats.map((coachEntry) => {
    const key = getKey(coachEntry);
    const matchingCourt = courtStats.find(
      (courtEntry) => getKey(courtEntry) === key
    );

    return {
      date: key,
      courtRevenue: matchingCourt ? matchingCourt.data.total_courts_revenue : 0,
      coachRevenue: coachEntry?.data?.totalRevenue || 0,
    };
  });

  return result;
};

export const useDashboardData = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalCourtOwners: 0,
    totalCoaches: 0,
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    revenueData: [],
    totalServiceSold: 0,
    totalServiceRevenue: 0,
    totalServiceUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const identityStats = await getIdentityStats();
        // CALL FROM JANUARY TO CURRENT MONTH
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const coachStatPerMonth = [];
        const courtStatsPerMonth = [];
        const paymentStatPerMonth = [];

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

        // TODO: Error in API
        // for (let month = 1; month <= currentMonth; month++) {
        //   const startDate = `${currentYear}-${month
        //     .toString()
        //     .padStart(2, "0")}-01T00:00:00`; // Start of the day
        //   const endDate =
        //     new Date(currentYear, month, 0).toISOString().split("T")[0] +
        //     "T23:59:59";
        //   const paymentData = await getPaymentStats(startDate, endDate);
        //   paymentStatPerMonth.push({
        //     month,
        //     data: paymentData,
        //   });
        // }

        var mergeStat = mergeStatsByUnit(
          coachStatPerMonth,
          courtStatsPerMonth,
          "month"
        );
        // mergeStat = mergeStatsByUnit(mergeStat, paymentStatPerMonth, "month");

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

export const filterData = async (start, end) => {
  const coachStat = [];
  const courtStat = [];
  const paymentStat = [];

  let mergeStat = [];

  const diffMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()); // Difference in months
  const diffYears = end.getFullYear() - start.getFullYear(); // Difference in years

  // Categorize the difference
  if (diffYears > 1 || diffMonths > 12) {
    // YEAR CATEGORY
    let current = new Date(start.getFullYear(), 0, 1);
    while (current <= end) {
      const yearStart = new Date(current.getFullYear(), 0, 1);
      const yearEnd = new Date(current.getFullYear(), 11, 31);

      const reponseCourt = await getCourtStats(
        yearStart.toISOString().split("T")[0],
        yearEnd.toISOString().split("T")[0]
      );

      const responseCoach = await getCoachStats(
        yearStart.toISOString().split("T")[0],
        yearEnd.toISOString().split("T")[0],
        "year"
      );

      // const responsePayment = await getPaymentStats(
      //   yearStart.toISOString(),
      //   yearEnd.toISOString()
      // );

      courtStat.push({
        year: current.getFullYear(),
        data: reponseCourt,
      });

      coachStat.push({
        year: current.getFullYear(),
        data: responseCoach,
      });

      // paymentStat.push({
      //   year: current.getFullYear(),
      //   data: responsePayment,
      // });

      mergeStat = mergeStatsByUnit(coachStat, courtStat, "year");
      // mergeStat = mergeStatsByUnit(mergedStat, paymentStat, "year");

      current.setFullYear(current.getFullYear() + 1);
    }
  } else if (diffMonths > 0) {
    // MONTH CATEGORY
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    while (current <= end) {
      const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
      const monthEnd = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      ); // last day of month

      const reponseCourt = await getCourtStats(
        monthStart.toISOString().split("T")[0],
        monthEnd.toISOString().split("T")[0]
      );
      const responseCoach = await getCoachStats(
        monthStart.toISOString().split("T")[0],
        monthEnd.toISOString().split("T")[0],
        "month"
      );
      // const paymentStats = await getPaymentStats(
      //   monthStart.toISOString(),
      //   monthEnd.toISOString()
      // );

      courtStat.push({
        month: current.getMonth() + 1,
        data: reponseCourt,
      });
      coachStat.push({
        month: current.getMonth() + 1,
        data: responseCoach,
      });
      // paymentStat.push({
      //   month: current.getMonth() + 1,
      //   data: paymentStats,
      // });

      mergeStat = mergeStatsByUnit(coachStat, courtStat, "month");
      // mergeStat = mergeStatsByUnit(mergeStat, paymentStat, "month");

      current.setMonth(current.getMonth() + 1);
    }
  } else {
    // DAY CATEGORY
    let current = new Date(start);
    while (current <= end) {
      const dayStart = new Date(current);
      const dayEnd = new Date(current);

      const courtStats = await getCourtStats(
        dayStart.toISOString().split("T")[0],
        dayEnd.toISOString().split("T")[0]
      );
      const coachStats = await getCoachStats(
        dayStart.toISOString().split("T")[0],
        dayEnd.toISOString().split("T")[0],
        "day"
      );
      // const paymentStats = await getPaymentStats(
      //   dayStart.toISOString(),
      //   dayEnd.toISOString()
      // );
      courtStat.push({
        date: current.toISOString(),
        data: courtStats,
      });
      coachStat.push({
        date: current.toISOString(),
        data: coachStats,
      });
      // paymentStat.push({
      //   date: current.toISOString(),
      //   data: paymentStats,
      // });
      mergeStat = mergeStatsByUnit(coachStat, courtStat, "day");
      // mergeStat =  mergeStatsByUnit(mergeStat, paymentStat, "day");
      current.setDate(current.getDate() + 1);
    }
  }

  return mergeStat;
};
