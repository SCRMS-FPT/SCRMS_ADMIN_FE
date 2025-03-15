import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, BarChart3, DollarSign } from "lucide-react";
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
import RevenueChart from "../components/charts/RevenueChart";
import BookingChart from "../components/charts/BookingChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { formatCurrency } from "@/lib/utils";

const Dashboard = () => {
  const { data: dashboardData, isLoading } = useDashboardData();

  // Revenue chart data
  const revenueData = [
    { date: "2024-01-01", revenue: 25000 },
    { date: "2024-02-01", revenue: 35000 },
    { date: "2024-03-01", revenue: 32000 },
    { date: "2024-04-01", revenue: 40000 },
    { date: "2024-05-01", revenue: 45000 },
    { date: "2024-06-01", revenue: 48000 },
    { date: "2024-07-01", revenue: 52000 },
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
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={dashboardData.totalUsers.toLocaleString()}
              icon={Users}
              trend={12}
              trendText="from last month"
            />
            <StatCard
              title="Total Courts"
              value={dashboardData.totalCourts.toLocaleString()}
              icon={Building2}
              trend={5}
              trendText="from last month"
            />
            <StatCard
              title="Total Bookings"
              value={dashboardData.totalBookings.toLocaleString()}
              icon={BarChart3}
              trend={18}
              trendText="from last month"
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(dashboardData.totalRevenue)}
              icon={DollarSign}
              trend={15}
              trendText="from last month"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly revenue for the current year
                </p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RevenueChart data={revenueData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monthly booking count
                </p>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BookingChart data={dashboardData.bookingTrends} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Latest payment activities across the platform
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
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
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
};

export default Dashboard;
