import { useEffect, useState } from "react";
import { ChevronDown, Users } from "lucide-react";
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
import { removeUserRole } from "@/api/userManagementAPI";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Coaches = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [listSpecialization, setListSpecialization] = useState([]);

  // Dialog state
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
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
    debouncedSearchTerm,
    null,
    null,
    specializationFilter !== "all" ? specializationFilter : null,
    currentPage,
    pageSize
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
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page on page size change
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSpecializationFilter(filter);
    setCurrentPage(1); // Reset to first page on filter change
  };
  // Handle view, edit, and delete actions
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
    // setSelectedCoach({ id });
    setSelectedDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCoach = async () => {
    try {
      setIsLoading(true);
      if (!selectedDelete) {
        showToast("Không thể xóa HLV không tồn tại.", "error");
        return;
      }
      await removeUserRole(selectedDelete, "coach");
      await deleteCoaches(selectedDelete);
      showToast("Huấn luyện viên đã được xóa thành công!", "success");
      setSelectedDelete(null);
      mutate();
    } catch (error) {
      console.log(error);
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
      const validObject = new FormData();
      validObject.append("FullName", formData.FullName);
      validObject.append("Email", formData.Email);
      validObject.append("RatePerHour", formData.RatePerHour);
      validObject.append("Bio", formData.Bio);
      validObject.append("Phone", formData.Phone);

      if (formData.NewAvatar) {
        validObject.append("NewAvatar", formData.NewAvatar);
      }

      if (formData.NewImages.length > 0) {
        formData.NewImages.forEach((file) => {
          validObject.append("NewImages", file);
        });
      }

      if (formData.ListSport.length > 0) {
        formData.ListSport.forEach((sport) => {
          validObject.append("ListSport", sport);
        });
      }
      if (formData.ExistingImageUrls.length > 0) {
        formData.ExistingImageUrls.forEach((url) => {
          validObject.append("ExistingImageUrls", url);
        });
      }

      if (formData.ImagesToDelete.length > 0) {
        formData.ImagesToDelete.forEach((url) => {
          validObject.append("ImagesToDelete", url);
        });
      }

      await updateCoach(selectedCoach.id, validObject);
      showToast("Cập nhật thông tin huấn luyện viên thành công!", "success");
      mutate();
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
        <div className="text-muted-foreground">
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
                className="h-8 w-8 rounded-full hover:bg-accent"
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCoach(row.id);
                }}
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
    <div className="space-y-6 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Huấn luyện viên
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách huấn luyện viên
          </p>
        </div>
      </div>

      <Card className="border-t-4 border-t-primary shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 dark:bg-muted/10 pb-2">
          <CardTitle className="text-lg font-semibold text-foreground">
            Danh sách huấn luyện viên
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <EnhancedTable
            data={coaches.data || []}
            columns={columns}
            isLoading={isCoachesLoading}
            onRowClick={handleRowClick}
            searchPlaceholder="Tìm kiếm huấn luyện viên..."
            noDataMessage="Không tồn tại một HLV nào."
            pageSize={pageSize}
            searchable={true}
            filterable={true}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
            currentFilter={specializationFilter}
            // Server pagination props
            serverPagination={true}
            totalItems={coaches.count}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onSearchChange={handleSearchChange}
            onPageSizeChange={handlePageSizeChange}
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
              className="bg-destructive hover:bg-destructive/90"
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
