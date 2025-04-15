import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable format with error handling
export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    
    if (includeTime) {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export type ChartData = {
  date: string;
  value: number;
};

export const generateChartData = (
  months: string[],
  values: number[]
): ChartData[] => {
  return months.map((month, index) => ({
    date: month,
    value: values[index],
  }));
};

export const filterBySearchTerm = <T extends Record<string, any>>(
  data: T[],
  searchTerm: string,
  fields: (keyof T)[]
): T[] => {
  if (!searchTerm) return data;

  const lowercasedTerm = searchTerm.toLowerCase();

  return data.filter((item) =>
    fields.some((field) => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowercasedTerm);
    })
  );
};

export function logoutUser() {
  localStorage.removeItem("authToken");
  window.location.href = "/login";
}

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
  }
};
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursString = hours > 0 ? `${hours} giờ` : "";
  const minutesString = remainingMinutes > 0 ? `${remainingMinutes} phút` : "";

  if (hoursString && minutesString) {
    return `${hoursString} ${minutesString}`;
  }

  return hoursString || minutesString || "0 phút";
};
