import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/utils";
import { Client } from "@/api/CourtApi";
import { API_GATEWAY_URL } from "@/api/config";

const Sports = () => {
  const pageSize = 10;
  const [sports, setSports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [deletingSport, setDeletingSport] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const apiClient = new Client(API_GATEWAY_URL);

  // Lấy dữ liệu danh sách môn thể thao
  const fetchSports = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.getSports();
      const filteredSports = response.sports.filter((sport) =>
        sport.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setSports(filteredSports.slice((page - 1) * pageSize, page * pageSize));
      setTotalPages(Math.ceil(filteredSports.length / pageSize));
    } catch (error) {
      showToast("Không thể lấy dữ liệu môn thể thao", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, [page, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mở hộp thoại tạo hoặc chỉnh sửa môn thể thao
  const openDialog = (sport = null) => {
    setEditingSport(sport);
    setFormData(
      sport
        ? { name: sport.name, description: sport.description, icon: sport.icon }
        : { name: "", description: "", icon: "" }
    );
    setIsDialogOpen(true);
  };

  // Đóng hộp thoại
  const closeDialog = () => {
    setEditingSport(null);
    setIsDialogOpen(false);
  };

  // Lưu môn thể thao (tạo mới hoặc cập nhật)
  const handleSave = async () => {
    const { name, description, icon } = formData;

    if (!name) {
      showToast("Tên môn thể thao là bắt buộc", "warning");
      return;
    }

    try {
      if (editingSport) {
        // Cập nhật môn thể thao
        await apiClient.updateSport({
          id: editingSport.id,
          name,
          description,
          icon,
        });
        showToast("Cập nhật môn thể thao thành công", "success");
      } else {
        // Tạo mới môn thể thao
        await apiClient.createSport({ name, description, icon });
        showToast("Tạo mới môn thể thao thành công", "success");
      }
      fetchSports();
      closeDialog();
    } catch (error) {
      showToast("Không thể lưu môn thể thao", "error");
    }
  };

  // Mở hộp thoại xác nhận xóa
  const openDeleteDialog = (sport) => {
    setDeletingSport(sport);
    setIsDeleteDialogOpen(true);
  };

  // Xóa môn thể thao
  const handleDelete = async () => {
    try {
      await apiClient.deleteSport(deletingSport.id);
      showToast("Xóa môn thể thao thành công", "success");
      fetchSports();
    } catch (error) {
      showToast("Không thể xóa môn thể thao", "error");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingSport(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            Quản lý môn thể thao
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách các môn thể thao trong hệ thống.
          </p>
        </div>
        <Button
          onClick={() => openDialog()}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm môn thể thao
        </Button>
      </div>

      {/* <Card>
        <CardContent className="p-0"> */}
      <div className="overflow-hidden rounded-md border">
        <div className="bg-muted/40 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm môn thể thao..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold text-center">Tên</TableHead>
                <TableHead className="font-semibold text-center">
                  Mô tả
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : sports.length > 0 ? (
                sports.map((sport) => (
                  <TableRow key={sport.id} className="hover:bg-muted/10">
                    <TableCell>
                      <span className="font-medium">
                        {sport.icon ? sport.icon + " - " : ""}
                        {sport.name}
                      </span>
                    </TableCell>
                    <TableCell>{sport.description}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDialog(sport)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(sport)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    Không tìm thấy môn thể thao nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && sports.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Trang <span className="font-medium">{page}</span> trên{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* </CardContent>
      </Card> */}

      {/* Hộp thoại tạo/chỉnh sửa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSport ? "Chỉnh sửa môn thể thao" : "Thêm môn thể thao"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Biểu tượng</Label>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingSport ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hộp thoại xác nhận xóa */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa môn thể thao</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            Bạn có chắc chắn muốn xóa{" "}
            <span className="font-bold">{deletingSport?.name}</span>? Hành động
            này không thể hoàn tác.
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Sports;
