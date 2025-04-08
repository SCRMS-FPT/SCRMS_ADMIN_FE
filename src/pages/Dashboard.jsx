import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building2,
  BarChart3,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CardSkeleton from "@/components/ui/CardSkeleton";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";
import ReusableChart from "@/components/charts/reusable-chart";
import { showToast, logoutUser } from "@/lib/utils";

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useDashboardData();

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
    { dataKey: "courtRevenue", label: "Doanh thu Sân", color: "#4F46E5" }, // Purple
    {
      dataKey: "coachRevenue",
      label: "Doanh thu Huấn luyện viên",
      color: "#E11D48",
    },
  ];
  // Dữ liệu biểu đồ doanh thu
  const sampleData = [
    { date: "2024-01-01", coachRevenue: 25000000, courtRevenue: 20000000 },
    { date: "2024-02-01", coachRevenue: 27000000, courtRevenue: 22000000 },
    { date: "2024-03-01", coachRevenue: 23000000, courtRevenue: 21000000 },
    { date: "2024-04-01", coachRevenue: 29000000, courtRevenue: 24000000 },
    { date: "2024-05-01", coachRevenue: 31000000, courtRevenue: 26000000 },
    { date: "2024-06-01", coachRevenue: 28000000, courtRevenue: 25000000 },
    { date: "2024-07-01", coachRevenue: 30000000, courtRevenue: 27000000 },
    { date: "2024-08-01", coachRevenue: 32000000, courtRevenue: 29000000 },
    { date: "2024-09-01", coachRevenue: 31000000, courtRevenue: 28000000 },
    { date: "2024-10-01", coachRevenue: 33000000, courtRevenue: 30000000 },
    { date: "2024-11-01", coachRevenue: 34000000, courtRevenue: 31000000 },
    { date: "2024-12-01", coachRevenue: 36000000, courtRevenue: 32000000 },
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

  return (
    <div className="space-y-6">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Tổng số người dùng"
              value={dashboardData.totalUsers}
              icon={Users}
            />
            <StatCard
              title="Tổng số chủ sân"
              value={dashboardData.totalCourtOwners}
              icon={Users}
            />
            <StatCard
              title="Tổng số huấn luyện viên"
              value={dashboardData.totalCoaches}
              icon={Users}
            />
            <StatCard
              title="Tổng số sân"
              value={dashboardData.totalCourts}
              icon={Building2}
            />
            {/* <StatCard
              title="Tổng số lượt đặt sân"
              value={dashboardData.totalBookings}
              icon={BarChart3}
            /> */}
            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(dashboardData.totalRevenue)}
              icon={DollarSign}
            />
          </div>
          <div className="space-y-8 py-8">
            <ReusableChart
              // data={dashboardData.revenueData}
              data={sampleData}
              margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
              lines={lines}
              title="Xu hướng doanh thu"
              description="Doanh thu hàng tháng trong năm hiện tại"
              icon={<DollarSign className="h-4 w-4 text-primary" />}
              valuePrefix=""
              valueSuffix="đ"
              color="hsl(var(--primary))"
            />
            {/* <ReusableChart
              data={bookingData}
              dataKey="booking"
              title="Xu hướng đặt sân"
              description="Số lượt đặt sân theo tháng"
              icon={<Calendar className="h-4 w-4 text-blue-500" />}
              valuePrefix=""
              valueSuffix=" lượt"
              color="hsl(215, 90%, 50%)"
            /> */}
          </div>
          {/* <Card>
            <CardHeader>
              <CardTitle>Giao dịch gần đây</CardTitle>
              <p className="text-sm text-muted-foreground">
                Hoạt động thanh toán mới nhất trên hệ thống
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">
                Xem tất cả giao dịch
              </Button>
            </CardFooter>
          </Card> */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
