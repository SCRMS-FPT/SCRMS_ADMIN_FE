"use client";

import { useState, useEffect } from "react";
import {
  UserMinus,
  PenIcon as UserPen,
  UserCog,
  Users2,
  Calendar,
  Search,
  Filter,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const Users = () => {
  const pageSize = 10;
  const [userRole, setUserRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [changeRoleUser, setChangeRoleUser] = useState(null);
  const [gender, setGender] = useState("");
  const [isReload, setReload] = useState(false);
  const [deleteUser, selectDeleteUser] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    selfIntroduction: "",
  });
  const [isUserDetailsDialogOpen, setIsUserDetailsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openUserDetailsDialog = (user) => {
    setSelectedUser(user);
    setIsUserDetailsDialogOpen(true);
  };

  // Close User Details Dialog
  const closeUserDetailsDialog = () => {
    setSelectedUser(null);
    setIsUserDetailsDialogOpen(false);
  };
  const usersData = getUsersData(
    pageSize,
    page,
    userRole === "all" ? "" : userRole,
    debouncedSearchTerm,
    isReload
  );
  const { users, isLoading, error, totalPages } = usersData;

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
    setSelectedRoles([]);
    setOpen(false);
  };

  const openDialog = (user = null) => {
    if (user != null) {
      setGender(user.gender);
    } else {
      setGender("");
    }
    setEditingUser(user);
    if (user != null) {
      setFormData({
        firstName: user.firstName,
        birthDate: user.birthDate?.split("T")[0] || "",
        email: user.email,
        lastName: user.lastName,
        phone: user.phone,
        selfIntroduction: user.selfIntroduction,
      });
    } else {
      setFormData();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    const { firstName, lastName, email, phone, birthDate, selfIntroduction } =
      formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!firstName || !lastName || !email || !birthDate || !gender) {
      showToast("Vui lòng điền đầy đủ các trường bắt buộc.", "warning");
      return;
    }

    if (!emailRegex.test(email)) {
      showToast("Email không đúng định dạng.", "warning");
      return;
    }

    if (!phone || !phoneRegex.test(phone)) {
      showToast("Số điện thoại phải gồm đúng 10 chữ số.", "warning");
      return;
    }

    if (editingUser) {
      try {
        const profileData = {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Phone: phone,
          BirthDate: birthDate,
          Gender: gender,
          SelfIntroduction: selfIntroduction ? selfIntroduction.trim() : null,
        };
        await updateUserInfo(editingUser.id, profileData);
        showToast("Đã thành công chỉnh sửa thông tin", "success");
        reloadUsers();
        closeDialog();
      } catch (err) {
        showToast(`${err.message}`, "error");
      }
    } else {
      // CREATE USER WHICH IS NOT IMPLEMENT
    }
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
    if (getUser && getUser.id === deleteUser.id) {
      showToast(`Bạn không thể xóa chính bản thân mình`, "error");
      return;
    }
    setIsDeleting(true);
    try {
      await removeUser(deleteUser.id);
      showToast(`Xóa người dùng thành công`, "success");
      reloadUsers();
    } catch (error) {
      showToast(`Xóa người dùng thất bại`, "error");
    }
    setIsDeleting(false);
    selectDeleteUser(null);
    setIsDeleteDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users2 className="h-6 w-6 text-primary" />
            Người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách người dùng
          </p>
        </div>
      </div>

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
            Tổng số: <span className="font-medium">{users?.length || 0}</span>{" "}
            người dùng
          </div>
        </div>

        {/* Mobile view */}
        <div className="md:hidden">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse space-y-2 p-4 border rounded-md"
                >
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : users && Array.isArray(users) && users.length > 0 ? (
            <div className="divide-y">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className={`p-4 ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Họ và tên
                    </div>
                    <div className="text-sm font-medium">
                      {user.firstName + " " + user.lastName}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Email
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Giới tính
                    </div>
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
                  </div>
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Quyền hạn
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={`
                                ${
                                  role === "Admin"
                                    ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                    : ""
                                }
                                ${
                                  role === "CourtOwner"
                                    ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                    : ""
                                }
                                ${
                                  role === "Coach"
                                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
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
                  </div>
                  <div className="mb-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Ngày khởi tạo
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(user.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        openUserDetailsDialog(user);
                      }}
                      title="Xem chi tiết"
                    >
                      <Info className="h-4 w-4" color="black" />
                      <span className="sr-only">Xem chi tiết</span>
                    </Button>

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
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <Search className="h-8 w-8 mb-2 opacity-40" />
                <p>Không có người dùng nào khả dụng.</p>
                <p className="text-sm">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Desktop view */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold">Họ và tên</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Giới tính</TableHead>
                <TableHead className="font-semibold">Số điện thoại</TableHead>
                <TableHead className="font-semibold">Quyền hạn</TableHead>
                <TableHead className="font-semibold">Ngày khởi tạo</TableHead>
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
                    onClick={() => openUserDetailsDialog(user)}
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
                                      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                      : ""
                                  }
                                  ${
                                    role === "CourtOwner"
                                      ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                      : ""
                                  }
                                  ${
                                    role === "Coach"
                                      ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
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
                          {new Date(user.createdAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="grid grid-cols-2 gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            openUserDetailsDialog(user);
                          }}
                          title="Xem chi tiết"
                        >
                          <Info className="h-4 w-4" color="black" />
                          <span className="sr-only">Xem chi tiết</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDialog(user);
                          }}
                          title="Chỉnh sửa"
                        >
                          <UserPen className="h-4 w-4" color="blue" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssignRoleDialog(user);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteDialog(user);
                          }}
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

      <Dialog
        id="userDetailsDialog"
        open={isUserDetailsDialogOpen}
        onOpenChange={setIsUserDetailsDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Thông tin người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-sm font-medium">Họ và tên</Label>
                <p className="text-muted-foreground">
                  {selectedUser.firstName + " " + selectedUser.lastName}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Giới tính</Label>
                <p className="text-muted-foreground">
                  {selectedUser.gender === "Male"
                    ? "Nam"
                    : selectedUser.gender === "Female"
                    ? "Nữ"
                    : "Khác"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Số điện thoại</Label>
                <p className="text-muted-foreground">
                  {selectedUser.phone || "Không rõ"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Quyền hạn</Label>
                <p className="text-xs text-muted-foreground italic">
                  ( Nếu không có gì hiển thị, đây chỉ là người dùng thông
                  thường. )
                </p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedUser.roles.map((role, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`${
                        role === "Admin"
                          ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                          : ""
                      } ${
                        role === "CourtOwner"
                          ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                          : ""
                      } ${
                        role === "Coach"
                          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                          : ""
                      }`}
                    >
                      {role === "Coach"
                        ? "HLV"
                        : role === "CourtOwner"
                        ? "Chủ sân"
                        : "Admin"}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Ngày khởi tạo</Label>
                <p className="text-muted-foreground">
                  {new Date(selectedUser.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={closeUserDetailsDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
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
                  name="firstName"
                  placeholder="Vui lòng nhập họ"
                  // defaultValue={editingUser?.firstName || ""}
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-9"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Tên
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Vui lòng nhập tên"
                  // defaultValue={editingUser?.lastName || ""}
                  value={formData.lastName}
                  onChange={handleChange}
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
                name="email"
                type="email"
                placeholder="Vui lòng nhập email"
                // defaultValue={editingUser?.email || ""}
                value={formData.email}
                onChange={handleChange}
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
                  name="phone"
                  type="text"
                  placeholder="Vui lòng nhập số điện thoại"
                  // defaultValue={editingUser?.phone || ""}
                  value={formData.phone}
                  onChange={handleChange}
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
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                // defaultValue={editingUser?.birthDate?.split("T")[0] || ""}
                className="h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selfIntroduction" className="text-sm font-medium">
                Giới thiệu bản thân
              </Label>
              <Textarea
                id="selfIntroduction"
                name="selfIntroduction"
                placeholder="Giới thiệu ngắn gọn về bản thân"
                // defaultValue={editingUser?.selfIntroduction || ""}
                value={formData.selfIntroduction}
                onChange={handleChange}
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

      {/* Role Assignment Dialog */}
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
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                        : role.Key === "CourtOwner"
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                        : "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
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
                              ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                              : ""
                          }
                          ${
                            role.Key === "CourtOwner"
                              ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                              : ""
                          }
                          ${
                            role.Key === "Coach"
                              ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={tryToDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
