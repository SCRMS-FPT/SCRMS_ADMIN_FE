export interface Facility {
  name: string;
  description?: string;
}

export interface Court {
  id: string;
  courtName: string;
  courtType: number; // 1: outdoor, 2: indoor, 3: covered
  status: string; // "active", "maintenance", "inactive"
  description?: string;
  slotDuration: number; // in minutes
  facilities?: Facility[];
  createdAt: string;
}
