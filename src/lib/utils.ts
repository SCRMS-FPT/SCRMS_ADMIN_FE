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

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
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
