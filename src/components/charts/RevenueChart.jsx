import { formatCurrency } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
  ChartTooltipLabel,
  ChartTooltipValue,
  LineChart,
} from "@/components/ui/chart";

const RevenueChart = ({ data }) => {
  return (
    <ChartContainer>
      <LineChart
        data={data}
        index="date"
        categories={["revenue"]}
        colors={["var(--chart-1)"]}
        valueFormatter={(value) => formatCurrency(value)}
        showLegend={false}
        showXAxis
        showYAxis
        showGridLines
      />
      <ChartTooltip>
        <ChartTooltipContent className="bg-background border shadow-sm">
          <ChartTooltipLabel className="font-medium" />
          <ChartTooltipItem index={0} className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--chart-1)]" />
            <span>Revenue:</span>
            <ChartTooltipValue className="font-medium" />
          </ChartTooltipItem>
        </ChartTooltipContent>
      </ChartTooltip>
    </ChartContainer>
  );
};

export default RevenueChart;
