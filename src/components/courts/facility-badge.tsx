import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Facility } from "@/components/courts/court";

interface FacilityBadgesProps {
  facilities: Facility[];
}

export function FacilityBadges({ facilities }: FacilityBadgesProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium flex items-center">
        <Info className="mr-1 h-3.5 w-3.5 text-primary/70" />
        Tiện nghi:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {facilities.map((facility) => (
          <TooltipProvider key={facility.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="text-xs py-1 px-2 transition-colors hover:bg-primary/10 hover:text-primary cursor-help"
                >
                  {facility.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p>{facility.description || "Không có mô tả"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
