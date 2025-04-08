import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "text-xs font-medium",
        status === "active" &&
          "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20",
        status === "maintenance" &&
          "bg-amber-500/15 text-amber-600 hover:bg-amber-500/20",
        status === "inactive" &&
          "bg-red-500/15 text-red-600 hover:bg-red-500/20"
      )}
    >
      {status === "active" && "Hoạt động"}
      {status === "maintenance" && "Bảo trì"}
      {status === "inactive" && "Không hoạt động"}
    </Badge>
  );
}
