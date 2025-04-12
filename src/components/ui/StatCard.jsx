import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, className, variant }) => {
  // Map of variant-specific styles that work in both light and dark modes
  const variantStyles = {
    cyan: {
      card: "border-l-4 border-l-cyan-500 dark:border-l-cyan-400",
      icon: "text-cyan-600 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-900/50",
    },
    emerald: {
      card: "border-l-4 border-l-emerald-500 dark:border-l-emerald-400",
      icon: "text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-900/50",
    },
    violet: {
      card: "border-l-4 border-l-violet-500 dark:border-l-violet-400",
      icon: "text-violet-600 dark:text-violet-400 bg-violet-100/50 dark:bg-violet-900/50",
    },
    amber: {
      card: "border-l-4 border-l-amber-500 dark:border-l-amber-400",
      icon: "text-amber-600 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-900/50",
    },
    rose: {
      card: "border-l-4 border-l-rose-500 dark:border-l-rose-400",
      icon: "text-rose-600 dark:text-rose-400 bg-rose-100/50 dark:bg-rose-900/50",
    },
  };

  const styles = variant ? variantStyles[variant] : {};

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        styles.card,
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("rounded-full p-2", styles.icon)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
