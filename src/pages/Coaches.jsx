"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Star, Users, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnhancedTable } from "@/components/ui/enhanced-table";
import { CoachViewDialog } from "@/components/ui/coach-view-dialog";
import { CoachEditDialog } from "@/components/ui/coach-edit-dialog";
import { useCoaches } from "@/hooks/useCoaches";
import { logoutUser, showToast } from "../lib/utils";
import { format } from "date-fns";
import { fetchSports } from "@/api/sportManagementAPI";
import {
  deleteCoaches,
  getCoachDetails,
  updateCoach,
} from "@/api/coachManagementAPI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Coaches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [listSpecialization, setListSpecialization] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    coaches,
    isLoading: isCoachesLoading,
    error,
    mutate,
  } = useCoaches(
    null,
    null,
    null,
    specializationFilter !== "all" ? specializationFilter : null
  );

  useEffect(() => {
    const getAllSport = async () => {
      const { sports } = await fetchSports();
      setListSpecialization(sports);
    };
    getAllSport();
  }, []);

  if (error) {
    switch (error.status) {
      case 401:
        logoutUser();
        return null;
      default:
        showToast(`Lỗi: ${error.message}`, "error");
    }
  }

  const handleViewCoach = async (id) => {
    try {
      setIsLoading(true);
      const coachDetails = await getCoachDetails(id);
      setSelectedCoach(coachDetails);
      setViewDialogOpen(true);
    } catch (error) {
      showToast("Không thể lấy thông tin huấn luyện viên.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCoach = async (id) => {
    try {
      setIsLoading(true);
      const coachDetails = await getCoachDetails(id);
      console.log("coachDetails", coachDetails);
      setSelectedCoach(coachDetails);
      setEditDialogOpen(true);
    } catch (error) {
      showToast("Không thể lấy thông tin huấn luyện viên.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCoach = (id) => {
    setSelectedCoach({ id });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCoach = async () => {
    try {
      setIsLoading(true);
      await deleteCoaches(selectedCoach.id);
      showToast("Huấn luyện viên đã được xóa thành công!", "success");
      mutate(); // Refresh the coaches list
    } catch (error) {
      showToast(
        "Không thể xóa huấn luyện viên này. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveCoach = async (formData) => {
    try {
      setIsLoading(true);
      await updateCoach(selectedCoach.id, formData);
      showToast("Cập nhật thông tin huấn luyện viên thành công!", "success");
      mutate(); // Refresh the coaches list
      return true;
    } catch (error) {
      showToast(
        "Không thể cập nhật thông tin huấn luyện viên. Vui lòng thử lại sau.",
        "error"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Định nghĩa cột cho bảng
  const columns = [
    {
      accessorKey: "fullName",
      header: "Họ và tên",
      enableSorting: true,
    },
    {
      accessorKey: "ratePerHour",
      header: "Giá",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="font-medium">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.ratePerHour || 0)}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian tạo",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-slate-600">
          {row.createdAt
            ? format(new Date(row.createdAt), "dd/MM/yyyy")
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-violet-50"
              >
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Thao tác</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                key="openProfile"
                onClick={() => handleViewCoach(row.id)}
              >
                Xem hồ sơ
              </DropdownMenuItem>
              <DropdownMenuItem
                key="editProfile"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCoach(row.id);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteCoach(row.id)}
                className="text-destructive"
              >
                Xóa huấn luyện viên
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const handleRowClick = (coach) => {
    handleViewCoach(coach.id);
  };

  const filterOptions = listSpecialization.map((sport) => ({
    value: sport.id,
    label: sport.name,
  }));

  return (
    <div className="space-y-6 p-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-violet-500" />
            Huấn luyện viên
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý danh sách huấn luyện viên
          </p>
        </div>
      </div>

      <Card className="border-t-4 border-t-violet-500 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-white pb-2">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Danh sách huấn luyện viên
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EnhancedTable
            data={coaches || []}
            columns={columns}
            isLoading={isCoachesLoading}
            onRowClick={handleRowClick}
            searchPlaceholder="Tìm kiếm huấn luyện viên..."
            noDataMessage="Không tồn tại một HLV nào."
            pageSize={10}
            searchable={true}
            filterable={true}
            filterOptions={filterOptions}
            onFilterChange={setSpecializationFilter}
            currentFilter={specializationFilter}
          />
        </CardContent>
      </Card>

      {/* View Coach Dialog */}
      <CoachViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        coach={selectedCoach}
        sports={listSpecialization}
      />

      {/* Edit Coach Dialog */}
      <CoachEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        coach={selectedCoach}
        sports={listSpecialization}
        onSave={handleSaveCoach}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa huấn luyện viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa huấn luyện viên này? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCoach}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Coaches;
