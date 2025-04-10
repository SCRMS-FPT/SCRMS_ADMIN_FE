"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function EnhancedTable({
  data,
  columns,
  isLoading = false,
  onRowClick,
  className,
  searchPlaceholder = "Tìm kiếm...",
  noDataMessage = "Không có dữ liệu",
  pageSize = 10,
  searchable = true,
  filterable = false,
  filterOptions = [],
  onFilterChange = () => {},
  currentFilter = "all",
  // Server pagination props
  serverPagination = false,
  totalItems = 0,
  currentPage = 1,
  onPageChange = () => {},
  onSearchChange = () => {},
  onPageSizeChange = () => {},
}) {
  const [page, setPage] = useState(currentPage);
  const [filteredData, setFilteredData] = useState(data || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  // For client-side pagination
  const totalPages = serverPagination
    ? Math.ceil(totalItems / pageSize)
    : Math.ceil(filteredData.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedData = serverPagination
    ? data
    : filteredData.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (serverPagination) {
      setPage(currentPage);
    }
  }, [currentPage, serverPagination]);

  useEffect(() => {
    if (!serverPagination && searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = data.filter((item) => {
        return Object.values(item).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(lowercasedSearch);
        });
      });
      setFilteredData(filtered);
      setPage(1);
    } else if (!serverPagination) {
      setFilteredData(data || []);
    }
  }, [searchTerm, data, serverPagination]);

  // Handle search for server-side pagination
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (serverPagination) {
      // Debounce search for server-side
      const timeoutId = setTimeout(() => {
        onSearchChange(value);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  // Handle page change for server-side pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
    if (serverPagination) {
      onPageChange(newPage);
    }
  };

  // Handle page size change for server-side pagination
  const handlePageSizeChange = (newSize) => {
    if (serverPagination) {
      onPageSizeChange(Number.parseInt(newSize));
    }
    setPage(1);
  };

  // Client-side sorting
  const handleSort = (key) => {
    if (serverPagination) return; // Disable client-side sorting when using server pagination

    let direction = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });

    if (direction === null) {
      setFilteredData([...data]);
      return;
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue === bValue) return 0;

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = String(aValue).localeCompare(String(bValue), "vi");
      return direction === "asc" ? comparison : -comparison;
    });

    setFilteredData(sorted);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground/70" />;
    if (sortConfig.direction === "asc")
      return <ArrowUpDown className="ml-1 h-4 w-4 text-primary" />;
    if (sortConfig.direction === "desc")
      return <ArrowUpDown className="ml-1 h-4 w-4 text-primary rotate-180" />;
    return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground/70" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex items-center gap-2">
          {searchable && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          )}

          {filterable && (
            <div className="flex items-center gap-2 ">
              <Select
                value={currentFilter}
                onValueChange={(value) => onFilterChange(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="10 hàng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 hàng</SelectItem>
              <SelectItem value="10">10 hàng</SelectItem>
              <SelectItem value="20">20 hàng</SelectItem>
              <SelectItem value="50">50 hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden bg-gradient-to-b from-white to-slate-50 shadow-sm">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-violet-50 to-slate-50">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.accessorKey}
                    className="font-semibold text-slate-700"
                    onClick={() =>
                      column.enableSorting &&
                      !serverPagination &&
                      handleSort(column.accessorKey)
                    }
                  >
                    <div
                      className={cn(
                        "flex items-center",
                        column.enableSorting &&
                          !serverPagination &&
                          "cursor-pointer hover:text-violet-600 transition-colors"
                      )}
                    >
                      {column.header}
                      {column.enableSorting &&
                        !serverPagination &&
                        getSortIcon(column.accessorKey)}{" "}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index} className="animate-pulse">
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                <AnimatePresence>
                  {paginatedData.map((row, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={cn(
                        "border-b transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50",
                        "hover:bg-violet-50/50",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="p-4 align-middle">
                          {column.cell
                            ? column.cell({ row })
                            : row[column.accessorKey]}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {noDataMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gradient-to-b from-slate-50 to-white">
            <div className="text-sm text-slate-500">
              Hiển thị{" "}
              <span className="font-medium">
                {serverPagination
                  ? (currentPage - 1) * pageSize + 1
                  : startIndex + 1}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {serverPagination
                  ? Math.min(currentPage * pageSize, totalItems)
                  : Math.min(startIndex + pageSize, filteredData.length)}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium">
                {serverPagination ? totalItems : filteredData.length}
              </span>{" "}
              kết quả
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(1)}
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(totalPages)}
                disabled={page === totalPages}
                className="h-8 w-8"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
