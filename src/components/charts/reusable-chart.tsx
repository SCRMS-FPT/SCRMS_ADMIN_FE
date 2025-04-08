import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  format,
  parseISO,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";
import { vi } from "date-fns/locale";
import { BarChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DataItem {
  date: string;
  [key: string]: any;
}

interface LineConfig {
  dataKey: string;
  label: string;
  color?: string;
}

interface ReusableChartProps {
  data: DataItem[];
  lines: LineConfig[];
  title: string;
  description?: string;
  icon?: React.ReactNode;
  valuePrefix?: string;
  valueSuffix?: string;
  showAverage?: boolean;
  locale?: Locale;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  valuePrefix,
  valueSuffix,
  labelFormatter,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-4">
        <p className="font-medium">{labelFormatter(new Date(label))}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center mt-2">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              {entry.name}:{" "}
              <span className="font-semibold">
                {valuePrefix || ""}
                {entry.value.toLocaleString()}
                {valueSuffix || ""}
              </span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReusableChart({
  data,
  lines,
  title,
  description = "Detailed analysis of your data",
  icon = <BarChart className="h-4 w-4 text-primary" />,
  valuePrefix = "$",
  valueSuffix = "",
  showAverage = true,
  locale = vi,
}: ReusableChartProps) {
  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [data]
  );

  const dateRange = useMemo(() => {
    const first = parseISO(sortedData[0]?.date);
    const last = parseISO(sortedData[sortedData.length - 1]?.date);
    return {
      days: differenceInDays(last, first),
      months: differenceInMonths(last, first),
      years: differenceInYears(last, first),
    };
  }, [sortedData]);

  const xLabelFormat = useMemo(() => {
    if (dateRange.years >= 1) return "yyyy";
    if (dateRange.months >= 1) return "MMM yyyy";
    return "dd MMM";
  }, [dateRange]);

  const labelFormatter = (date: Date) => {
    if (dateRange.years >= 1) return format(date, "'Năm' yyyy", { locale });
    if (dateRange.months >= 1)
      return format(date, "'Tháng' MM 'năm' yyyy", { locale });
    return format(date, "dd MMM yyyy", { locale });
  };

  const totalValues = lines.map((line) =>
    sortedData.reduce((sum, item) => sum + (item[line.dataKey] || 0), 0)
  );

  const averageValues = totalValues.map((total) => total / sortedData.length);

  const totalValue = totalValues.reduce((sum, value) => sum + value, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {lines.map((line, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-muted px-3 py-1 rounded-md"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: line.color || "hsl(var(--primary))",
                  }}
                />
                <span className="font-medium">
                  {line.label}: {valuePrefix}
                  {totalValues[index].toLocaleString()}
                  {valueSuffix}
                </span>
              </div>
            ))}
            <div className="flex items-center space-x-1 bg-muted px-3 py-1 rounded-md">
              {icon}
              <span className="font-medium">
                Tổng: {totalValue.toLocaleString()}
                {valueSuffix}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  format(new Date(date), xLabelFormat, { locale })
                }
                stroke="hsl(var(--foreground))"
              />
              <YAxis
                domain={[0, "auto"]}
                tickFormatter={(value) => {
                  if (value >= 1_000_000)
                    return `${(value / 1_000_000).toFixed(1)} triệu`;
                  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
                  return value;
                }}
                stroke="hsl(var(--foreground))"
              />
              <Tooltip
                content={
                  <CustomTooltip
                    valuePrefix={valuePrefix}
                    valueSuffix={valueSuffix}
                    labelFormatter={labelFormatter}
                  />
                }
              />
              <Legend />
              {showAverage &&
                lines.map((line, index) => (
                  <ReferenceLine
                    key={index}
                    y={averageValues[index]}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                  />
                ))}
              {lines.map((line, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.label}
                  stroke={line.color || "hsl(var(--primary))"}
                  strokeWidth={3}
                  dot={{
                    stroke: line.color || "hsl(var(--primary))",
                    strokeWidth: 2,
                    r: 4,
                    fill: "hsl(var(--background))",
                  }}
                  activeDot={{
                    r: 6,
                    stroke: line.color || "hsl(var(--primary))",
                    strokeWidth: 2,
                    fill: "hsl(var(--background))",
                  }}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
