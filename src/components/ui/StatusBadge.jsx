import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status }) => {
  const statusMap = {
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "secondary" },
    pending: { label: "Pending", variant: "warning" },
    completed: { label: "Completed", variant: "success" },
    failed: { label: "Failed", variant: "destructive" },
    maintenance: { label: "Maintenance", variant: "warning" },
    resolved: { label: "Resolved", variant: "success" },
    0: { label: "Mở", variant: "default" },
    1: { label: "Đóng", variant: "destructive" },
    2: { label: "Bảo trì", variant: "outline" },
    "under review": { label: "Under Review", variant: "warning" },
  };

  const statusInfo = statusMap[status] || {
    label: status,
    variant: "default",
  };

  return (
    <Badge variant={statusInfo.variant} className="capitalize">
      {statusInfo.label}
    </Badge>
  );
};

export default StatusBadge;
