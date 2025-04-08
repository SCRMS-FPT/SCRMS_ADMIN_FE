"use client";

import { Tag } from "lucide-react";
import { CourtCard } from "./court-card";
import type { Court } from "@/components/courts/court";

interface SportSectionProps {
  sport: string;
  courts: Court[];
}

export function SportSection({ sport, courts }: SportSectionProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <h3 className="text-xl font-semibold flex items-center bg-gradient-to-r from-primary/80 to-primary p-2 rounded-lg text-primary-foreground shadow-sm">
        <Tag className="mr-2 h-5 w-5" />
        <span>Sân {sport}</span>
      </h3>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courts.map((court) => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </div>
  );
}
