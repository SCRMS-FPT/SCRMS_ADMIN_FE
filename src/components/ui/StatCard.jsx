import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const StatCard = ({ title, value, icon: Icon, trend, trendText }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trendText && (
          <p className="text-xs text-muted-foreground">
            {trend > 0 ? "+" : ""}
            {trend}% {trendText}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard

