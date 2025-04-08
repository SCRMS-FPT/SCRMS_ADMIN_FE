export const ChartContainer = ({ children }) => {
  return <div className="relative">{children}</div>
}

export const LineChart = ({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  showLegend,
  showXAxis,
  showYAxis,
  showGridLines,
}) => {
  return <div>LineChart Placeholder</div>
}

export const ChartTooltip = ({ children }) => {
  return <div>{children}</div>
}

export const ChartTooltipContent = ({ className, children }) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltipLabel = ({ className, children }) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltipItem = ({ index, className, children }) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltipValue = ({ className, children }) => {
  return <span className={className}>{children}</span>
}

