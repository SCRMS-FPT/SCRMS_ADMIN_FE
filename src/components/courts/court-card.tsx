"use client";

import { useState } from "react";
import { Clock, Calendar, Edit, Trash2, MapPin, Shield } from "lucide-react";
import { formatTime, formatDate } from "@/lib/utils";
import type { Court } from "@/components/courts/court";
import { StatusBadge } from "./status-badge";
import { FacilityBadges } from "./facility-badge";
import { DeleteCourtDialog } from "./delete-court-dialog";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  court: Court;
}

export function CourtCard({ court }: CourtCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getCourtTypeIcon = (type: number) => {
    switch (type) {
      case 3:
        return <Shield className="h-4 w-4 text-emerald-500" title="Có che" />;
      case 2:
        return <MapPin className="h-4 w-4 text-violet-500" title="Trong nhà" />;
      default:
        return <MapPin className="h-4 w-4 text-amber-500" title="Ngoài trời" />;
    }
  };

  const getCourtTypeText = (type: number) => {
    switch (type) {
      case 3:
        return "có che";
      case 2:
        return "trong nhà";
      default:
        return "ngoài trời";
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group">
      <div
        className={cn(
          "h-1 w-full bg-gradient-to-r",
          court.status === "active"
            ? "from-emerald-400 to-emerald-600"
            : court.status === "maintenance"
            ? "from-amber-400 to-amber-600"
            : "from-red-400 to-red-600"
        )}
      />

      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {court.courtName}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="mr-1">Sân</span>
              {getCourtTypeIcon(court.courtType)}
              <span className="ml-1">{getCourtTypeText(court.courtType)}</span>
            </CardDescription>
          </div>
          <StatusBadge status={court.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {court.description && (
          <p className="text-sm text-muted-foreground border-l-2 border-primary/20 pl-2 italic">
            {court.description}
          </p>
        )}

        <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
          <Clock className="mr-2 h-4 w-4 text-primary" />
          <span>
            Thời gian một buổi:{" "}
            <span className="font-medium">
              {formatTime(court.slotDuration)}
            </span>
          </span>
        </div>

        {court.facilities && court.facilities.length > 0 && (
          <FacilityBadges facilities={court.facilities} />
        )}

        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3 text-primary/70" />
          <span>Ngày tạo: {formatDate(court.createdAt)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Edit className="mr-1 h-3 w-3" /> Chỉnh sửa
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 opacity-80 hover:opacity-100 transition-opacity"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="mr-1 h-3 w-3" /> Xóa
        </Button>
      </CardFooter>

      <DeleteCourtDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        courtName={court.courtName}
        onConfirm={() => {
          // Handle delete logic here
          console.log("Deleting court:", court.id);
          setShowDeleteDialog(false);
        }}
      />
    </Card>
  );
}
