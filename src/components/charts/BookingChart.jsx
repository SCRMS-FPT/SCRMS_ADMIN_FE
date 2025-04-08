import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartTooltipLabel,
  ChartTooltipValue,
  LineChart,
} from "@/components/ui/chart"

const BookingChart = ({ data }) => {
  return (
    <ChartContainer>
      <LineChart
        data={data}
        index="date"
        categories={["count"]}
        colors={["var(--chart-2)"]}
        valueFormatter={(value) => `${value} bookings`}
        showLegend={false}
        showXAxis
        showYAxis
        showGridLines
      />
      <ChartTooltip>
        <ChartTooltipContent className="bg-background border shadow-sm">
          <ChartTooltipLabel className="font-medium" />
          <ChartTooltipItem index={0} className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--chart-2)]" />
            <span>Bookings:</span>
            <ChartTooltipValue className="font-medium" />
          </ChartTooltipItem>
        </ChartTooltipContent>
      </ChartTooltip>
    </ChartContainer>
  )
}

export default BookingChart

