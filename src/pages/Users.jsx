import { useState, useEffect } from "react";
import { ChevronDown, UserMinus, UserPen, UserSquare2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import {
  getUsersData,
  updateUserInfo,
  assignRoleUser,
  removeUser,
} from "@/hooks/useUsers";
import { showToast, logoutUser } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, Search, UserCog, Users2 } from "lucide-react";

const Users = () => {
  const pageSize = 10;
  const [userRole, setUserRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [changeRoleUser, setChangeRoleUser] = useState(null);
  const [gender, setGender] = useState(editingUser?.gender || "");
  const [isReload, setReload] = useState(false);
  const [deleteUser, selectDeleteUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { users, isLoading, error, totalPages } = getUsersData(
    pageSize,
    page,
    userRole === "all" ? "" : userRole,
    debouncedSearchTerm,
    isReload
  );

  if (error) {
    switch (error.status) {
      case 401: {
        logoutUser();
        return null;
      }
      default: {
        showToast(`Lỗi khi lấy dữ liệu`, "error");
        console.log(error.message);
      }
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const availableRoles = [
    { Key: "Admin", Display: "Admin" },
    // { Key: "User", Display: "Người dùng" },
    { Key: "CourtOwner", Display: "Chủ sân" },
    { Key: "Coach", Display: "Huấn luyện viên" },
  ];

  const toggleRole = (role) => {
    setSelectedRoles((prev) =>
      prev.includes(role.Key)
        ? prev.filter((r) => r !== role.Key)
        : [...prev, role.Key]
    );
  };

  const reloadUsers = () => {
    setReload((prev) => !prev);
  };

  const handleSubmitChangeRole = async () => {
    const request = {
      UserId: changeRoleUser.id,
      Roles: selectedRoles,
    };
    try {
      await assignRoleUser(request);
      showToast("Đổi quyền hạn thành công", "success");
      reloadUsers();
    } catch (err) {
      showToast(`Lỗi đã xảy ra khi đổi quyền hạn`, "error");
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  const openAssignRoleDialog = (user) => {
    if (user != null) {
      setChangeRoleUser(user);
      setSelectedRoles(user.roles);
      setOpen(true);
    }
  };

  const closeChangeRole = () => {
    setChangeRoleUser(null);
    setSelectedRoles(null);
    setOpen(false);
  };

  const openDialog = (user = null) => {
    if (user != null) {
      setGender(user.gender);
    }
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    if (editingUser) {
      try {
        const profileData = {
          FirstName: document.getElementById("firstName").value,
          LastName: document.getElementById("lastName").value,
          Email: document.getElementById("email").value,
          Phone: document.getElementById("phone").value || null,
          BirthDate: document.getElementById("birthDate").value,
          Gender: gender,
          SelfIntroduction:
            document.getElementById("selfIntroduction").value.trim() || null,
        };
        await updateUserInfo(editingUser.id, profileData);
        showToast("Đã thành công chỉnh sửa thông tin", "success");
        reloadUsers();
      } catch (err) {
        showToast(`Lỗi khi tải dữ liệu người dùng`, "error");
      }
    } else {
    }
    closeDialog();
  };

  const openDeleteDialog = (user) => {
    selectDeleteUser(user);
    setIsDeleteDialogOpen(true);
  };

  const tryToDelete = async () => {
    if (!deleteUser) {
      showToast(`Người dùng không tồn tại`, "error");
      return;
    }
    const getUser = localStorage.getItem("user");
    if (getUser.id === deleteUser.id) {
      showToast(`Bạn không thể xóa chính bản thân mình`, "error");
      return;
    }
    setIsDeleting(true);
    try {
      await removeUser(deleteUser.id);
      showToast(`Xóa người dùng thành công`, "success");
    } catch (error) {
      showToast(`Xóa người dùng thất bại`, "error");
    }
    setIsDeleting(false);
    selectDeleteUser(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm người dùng thông qua tên..."
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
      {/* <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chia theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="user">Người dùng</SelectItem>
              <SelectItem value="court owner">Chủ sân</SelectItem>
              <SelectItem value="coach">Huấn luyện viên</SelectItem>
            </SelectContent>
          </Select> */}
      {/* </div>
         <Button onClick={() => openDialog()}>Add User</Button> 
      </div> */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users2 className="h-6 w-6 text-violet-500" />
            Người dùng
          </h1>
          <p className="text-slate-500 mt-1">Quản lý danh sách người dùng</p>
        </div>
      </div>
      <Dialog
        id="userDialog"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingUser ? "Chỉnh sửa người dùng" : "Thêm mới người dùng"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Chỉnh sửa thông tin người dùng."
                : "Tạo một tài khoản người dùng mới."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Họ
                </Label>
                <Input
                  id="firstName"
                  placeholder="Vui lòng nhập họ"
                  defaultValue={editingUser?.firstName || ""}
                  className="h-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Tên
                </Label>
                <Input
                  id="lastName"
                  placeholder="Vui lòng nhập tên"
                  defaultValue={editingUser?.lastName || ""}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Vui lòng nhập email"
                defaultValue={editingUser?.email || ""}
                className="h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Giới tính
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-9 w-full" id="gender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                    <SelectItem value="Other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Vui lòng nhập số điện thoại"
                  defaultValue={editingUser?.phone || ""}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthDate" className="text-sm font-medium">
                Ngày sinh
              </Label>
              <Input
                id="birthDate"
                type="date"
                defaultValue={editingUser?.birthDate?.split("T")[0] || ""}
                className="h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selfIntroduction" className="text-sm font-medium">
                Giới thiệu bản thân
              </Label>
              <Textarea
                id="selfIntroduction"
                placeholder="Giới thiệu ngắn gọn về bản thân"
                defaultValue={editingUser?.selfIntroduction || ""}
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeDialog}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingUser ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog id="roleDialog" open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Cấp quyền cho người dùng
            </DialogTitle>
            <DialogDescription>
              Chọn các quyền vai trò bạn muốn cấp cho người dùng này.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">
                Người dùng:{" "}
                <span className="font-semibold">
                  {changeRoleUser?.firstName + " " + changeRoleUser?.lastName}
                </span>
              </p>
              <p className="text-sm text-muted-foreground">
                Email: {changeRoleUser?.email}
              </p>
            </div>
            <div className="space-y-3">
              {availableRoles.map((role) => (
                <div
                  key={role.Key}
                  className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${
                    selectedRoles.includes(role.Key)
                      ? role.Key === "Admin"
                        ? "bg-red-50 border-red-200"
                        : role.Key === "CourtOwner"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-green-50 border-green-200"
                      : "bg-background"
                  }`}
                >
                  <Checkbox
                    id={`role-${role.Key}`}
                    checked={selectedRoles.includes(role.Key)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <label
                    htmlFor={`role-${role.Key}`}
                    className="flex-1 flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-medium">{role.Display}</span>
                    {selectedRoles.includes(role.Key) && (
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            role.Key === "Admin"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : ""
                          }
                          ${
                            role.Key === "CourtOwner"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : ""
                          }
                          ${
                            role.Key === "Coach"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : ""
                          }
                        `}
                      >
                        Đã chọn
                      </Badge>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeChangeRole}>
              Hủy
            </Button>
            <Button onClick={handleSubmitChangeRole}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-md border">
            <div className="bg-muted/40 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-[300px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger className="w-[180px] hidden sm:flex">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="CourtOwner">Chủ sân</SelectItem>
                    <SelectItem value="Coach">Huấn luyện viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Tổng số:{" "}
                <span className="font-medium">{users?.length || 0}</span> người
                dùng
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Họ và tên</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Giới tính</TableHead>
                    <TableHead className="font-semibold">
                      Số điện thoại
                    </TableHead>
                    <TableHead className="font-semibold">Quyền hạn</TableHead>
                    <TableHead className="font-semibold">
                      Ngày khởi tạo
                    </TableHead>
                    <TableHead className="text-center font-semibold">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <TableRow key={i} className="animate-pulse">
                          <TableCell colSpan={7}>
                            <div className="flex items-center gap-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : users && Array.isArray(users) && users.length > 0 ? (
                    users.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={`group transition-colors ${
                          index % 2 === 0 ? "bg-background" : "bg-muted/20"
                        } hover:bg-primary/5`}
                      >
                        <TableCell className="font-medium">
                          {user.firstName + " " + user.lastName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.gender === "Male"
                                ? "default"
                                : user.gender === "Female"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {user.gender === "Male"
                              ? "Nam"
                              : user.gender === "Female"
                              ? "Nữ"
                              : "Khác"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.phone ? user.phone : "Không rõ"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.roles.map((role, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className={`
                                  ${
                                    role === "Admin"
                                      ? "bg-red-100 text-red-800 border-red-200"
                                      : ""
                                  }
                                  ${
                                    role === "CourtOwner"
                                      ? "bg-blue-100 text-blue-800 border-blue-200"
                                      : ""
                                  }
                                  ${
                                    role === "Coach"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : ""
                                  }
                                `}
                              >
                                {role === "Coach"
                                  ? "HLV"
                                  : role === "CourtOwner"
                                  ? "Chủ sân"
                                  : "Admin"}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              {new Date(user.createdAt).toLocaleString(
                                "vi-VN",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => openDialog(user)}
                              title="Chỉnh sửa"
                            >
                              <UserPen className="h-4 w-4" color="blue" />
                              <span className="sr-only">Chỉnh sửa</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => openAssignRoleDialog(user)}
                              title="Thay đổi vai trò"
                            >
                              <UserCog className="h-4 w-4" color="green" />
                              <span className="sr-only">Thay đổi vai trò</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              title="Xóa"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <UserMinus className="h-4 w-4" color="red" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="7" className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Search className="h-8 w-8 mb-2 opacity-40" />
                          <p>Không có người dùng nào khả dụng.</p>
                          <p className="text-sm">
                            Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bạn có chắc chắn muốn xóa người dùng này? Hành động này
                    không thể hoàn tác.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Hủy
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={tryToDelete}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? "Đang xóa..." : "Xóa"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {!isLoading && users && users.length > 0 && (
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
                    className="h-8"
                  >
                    Trước
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="h-8"
                  >
                    Kế tiếp
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
