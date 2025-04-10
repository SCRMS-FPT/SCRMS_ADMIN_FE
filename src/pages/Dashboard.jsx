"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, DollarSign, Calendar } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CardSkeleton from "@/components/ui/CardSkeleton";
import StatCard from "@/components/ui/StatCard";
import { useDashboardData, filterData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";
import ReusableChart from "@/components/charts/reusable-chart";
import { showToast, logoutUser } from "@/lib/utils";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();
  const [startDate, setStartDate] = useState(""); // Start date state
  const [endDate, setEndDate] = useState(""); // End date state
  if (error) {
    switch (error.status) {
      case 401: {
        logoutUser();
        return null;
      }
      default: {
        showToast(`Error: ${error.message}`, "error");
        console.log(error);
      }
    }
  }
  const lines = [
    { dataKey: "courtRevenue", label: "Doanh thu Sân", color: "#8b5cf6" }, // Purple
    {
      dataKey: "coachRevenue",
      label: "Doanh thu Huấn luyện viên",
      color: "#E11D48",
    },
  ];

  const adminLines = [
    {
      dataKey: "packageRevenue",
      label: "Doanh thu bán gói",
      color: "#fdbc00",
    },
  ];
  // Dữ liệu biểu đồ doanh thu
  const sampleData = [
    {
      date: "2024-01-01",
      coachRevenue: 25000000,
      courtRevenue: 20000000,
    },
    {
      date: "2024-02-01",
      coachRevenue: 27000000,
      courtRevenue: 22000000,
    },
    {
      date: "2024-03-01",
      coachRevenue: 23000000,
      courtRevenue: 21000000,
    },
    {
      date: "2024-04-01",
      coachRevenue: 29000000,
      courtRevenue: 24000000,
    },
    {
      date: "2024-05-01",
      coachRevenue: 31000000,
      courtRevenue: 26000000,
    },
    {
      date: "2024-06-01",
      coachRevenue: 28000000,
      courtRevenue: 25000000,
    },
    {
      date: "2024-07-01",
      coachRevenue: 30000000,
      courtRevenue: 27000000,
    },
    {
      date: "2024-08-01",
      coachRevenue: 32000000,
      courtRevenue: 29000000,
    },
    {
      date: "2024-09-01",
      coachRevenue: 31000000,
      courtRevenue: 28000000,
    },
    {
      date: "2024-10-01",
      coachRevenue: 33000000,
      courtRevenue: 30000000,
    },
    {
      date: "2024-11-01",
      coachRevenue: 34000000,
      courtRevenue: 31000000,
    },
    {
      date: "2024-12-01",
      coachRevenue: 36000000,
      courtRevenue: 32000000,
    },
  ];

  const bookingData = [
    { date: "2024-01-01", booking: 125 },
    { date: "2024-02-01", booking: 400 },
    { date: "2024-03-01", booking: 800 },
    { date: "2024-04-01", booking: 600 },
    { date: "2024-05-01", booking: 658 },
    { date: "2024-06-01", booking: 785 },
    { date: "2024-07-01", booking: 657 },
  ];

  const packageData = [
    { date: "2024-01-01", packageRevenue: 10000000 },
    { date: "2024-01-03", packageRevenue: 12000000 },
    { date: "2024-01-05", packageRevenue: 15000000 },
    { date: "2024-01-08", packageRevenue: 13000000 },
    { date: "2024-01-15", packageRevenue: 17000000 },
    { date: "2024-01-20", packageRevenue: 16000000 },
    { date: "2024-01-23", packageRevenue: 18000000 },
    { date: "2024-01-25", packageRevenue: 19000000 },
    { date: "2024-01-26", packageRevenue: 20000000 },
    { date: "2024-01-27", packageRevenue: 21000000 },
    { date: "2024-01-28", packageRevenue: 22000000 },
    { date: "2024-01-29", packageRevenue: 23000000 },
  ];

  const handleDateRangeChange = async () => {
    const mergeStat = await filterData(startDate, endDate);
    console.log("Filtered Data:", mergeStat);
  };

  return (
    <div className="space-y-6 bg-gradient-to-b from-slate-50 to-white">
      {isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <StatCard
              title="Tổng số người dùng"
              value={dashboardData.totalUsers}
              icon={Users}
              className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200"
              iconClassName="text-cyan-600 bg-cyan-100"
            />
            <StatCard
              title="Tổng số chủ sân"
              value={dashboardData.totalCourtOwners}
              icon={Users}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
              iconClassName="text-emerald-600 bg-emerald-100"
            />
            <StatCard
              title="Tổng số huấn luyện viên"
              value={dashboardData.totalCoaches}
              icon={Users}
              className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200"
              iconClassName="text-violet-600 bg-violet-100"
            />
            <StatCard
              title="Tổng số sân"
              value={dashboardData.totalCourts}
              icon={Building2}
              className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
              iconClassName="text-amber-600 bg-amber-100"
            />
            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(dashboardData.totalRevenue)}
              icon={DollarSign}
              className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200"
              iconClassName="text-rose-600 bg-rose-100"
            />
          </div>

          <div className="relative py-6">
            <Separator className="absolute left-0 right-0 border-t-2 border-dashed border-slate-200" />
            <div className="flex justify-center">
              <span className="relative bg-white px-4 -top-3 text-slate-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Thống kê theo thời gian</span>
              </span>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="border-t-4 border-t-sky-500 shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-end gap-4 justify-center">
                  {/* Start Date Picker */}
                  <div className="min-w-[200px]">
                    <label
                      htmlFor="start-date"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Từ ngày
                    </label>
                    <ReactDatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày bắt đầu"
                      className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    />
                  </div>

                  {/* End Date Picker */}
                  <div className="min-w-[200px]">
                    <label
                      htmlFor="end-date"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Đến ngày
                    </label>
                    <ReactDatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Chọn ngày kết thúc"
                      className="border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleDateRangeChange}
                    className="self-end bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transition-all"
                  >
                    Xem thống kê
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Doanh thu thực tế :  */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
              <ReusableChart
                data={dashboardData.revenueData}
                margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
                lines={adminLines}
                title="Xu hướng doanh thu"
                description="Doanh thu theo số lượng thực tế nhận vào"
                icon={<DollarSign className="h-4 w-4 text-amber-500" />}
                valuePrefix=""
                valueSuffix="đ"
                color="#fdbc00"
              />
            </Card>

            {/* Tổng doanh thu của mọi người dùng */}
            <Card className="overflow-hidden border-none shadow-lg">
              <div className="h-1 bg-gradient-to-r from-violet-400 via-violet-500 to-violet-600"></div>
              <ReusableChart
                data={dashboardData.revenueData}
                margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
                lines={lines}
                title="Xu hướng tổng doanh thu theo tháng"
                description="Doanh thu hàng tháng trong năm hiện tại"
                icon={<DollarSign className="h-4 w-4 text-violet-500" />}
                valuePrefix=""
                valueSuffix="đ"
                color="#8b5cf6"
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
