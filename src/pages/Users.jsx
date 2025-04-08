import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import StatusBadge from "@/components/ui/StatusBadge";
import { getUsersData, updateUserInfo, assignRoleUser } from "@/hooks/useUsers";
import { showToast, logoutUser } from "@/lib/utils";

const Users = () => {
  const pageSize = 10;
  const [userRole, setUserRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [changeRoleUser, setChangeRoleUser] = useState(null);
  const [gender, setGender] = useState(editingUser?.gender || "");
  const [isReload, setReload] = useState(false);
  const { users, isLoading, error, totalPages } = getUsersData(
    pageSize,
    page,
    userRole,
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
        showToast(`Error: ${error.message}`, "error");
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

  const [open, setOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([
    changeRoleUser?.roles || [],
  ]);

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
      showToast(`Lỗi: ${err.message}`, "error");
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
    // setChangeRoleUser(null);
    // setSelectedRoles(null);
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
        showToast(`Lỗi: ${err.message}`, "error");
      }
    } else {
    }
    closeDialog();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm kiếm người dùng thông qua tên..."
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
        </div>
        {/* <Button onClick={() => openDialog()}>Add User</Button> */}
      </div>

      <Dialog
        id="userDialog"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Chỉnh sửa người dùng" : "Thêm mới người dùng"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Chỉnh sửa thông tin người dùng."
                : "Tạo một tài khoản người dùng mới."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Họ</Label>
              <Input
                id="firstName"
                placeholder="Vui lòng nhập họ"
                defaultValue={editingUser?.firstName || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Tên</Label>
              <Input
                id="lastName"
                placeholder="Vui lòng nhập tên"
                defaultValue={editingUser?.lastName || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Vui lòng nhập email"
                defaultValue={editingUser?.email || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                className="w-full"
                value={gender}
                onValueChange={setGender}
                // defaultValue={editingUser?.gender || ""}
              >
                <SelectTrigger className="w-full" id="gender">
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
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Vui lòng nhập số điện thoại"
                defaultValue={editingUser?.phone || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <Input
                id="birthDate"
                type="date"
                defaultValue={editingUser?.birthDate?.split("T")[0] || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="selfIntroduction">Giới thiệu bản thân</Label>
              <Textarea
                id="selfIntroduction"
                placeholder="Giới thiệu ngắn gọn về bản thân"
                defaultValue={editingUser?.selfIntroduction || ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Hủy
            </Button>
            <Button onClick={handleSave}>
              {editingUser ? "Lưu" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog id="roleDialog" open={open} onOpenChange={setOpen}>
        <DialogContent>
          {" "}
          <DialogTitle>Cấp quyền cho người dùng</DialogTitle>
          <DialogDescription>
            Hãy chọn vào các ô phần quyền mong muốn và người dùng sẽ được cấp
            các quyền vai trò tương ứng.
          </DialogDescription>
          <DialogHeader>
            Chọn vai trò cho{" "}
            {changeRoleUser?.firstName + " " + changeRoleUser?.lastName}
          </DialogHeader>
          <div className="space-y-2">
            {availableRoles.map((role) => (
              <label key={role.Key} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedRoles.includes(role.Key)}
                  onCheckedChange={() => toggleRole(role)}
                />
                <span>{role.Display}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeChangeRole}>
              Đóng
            </Button>
            <Button onClick={handleSubmitChangeRole}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Giới tính</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Quyền hạn</TableHead>
                    <TableHead>Ngày khởi tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && Array.isArray(users) && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.firstName + " " + user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.gender === "Male"
                            ? "Nam"
                            : user.gender === "Female"
                            ? "Nữ"
                            : "Khác"}
                        </TableCell>
                        <TableCell>
                          {user.phone ? user.phone : "Không rõ"}
                        </TableCell>
                        <TableCell>
                          {user.roles.length > 1
                            ? user.roles.join(", ")
                            : user.roles[0]}
                        </TableCell>
                        {/* <TableCell>{user.birthDate}</TableCell> */}
                        <TableCell>
                          {new Date(user.createdAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </TableCell>
                        {/* <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell> */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Thao tác</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {/* <DropdownMenuItem>Xem chi tiết</DropdownMenuItem> */}
                              <DropdownMenuItem
                                onClick={() => openDialog(user)}
                              >
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  openAssignRoleDialog(user);
                                }}
                              >
                                Thay đổi vai trò
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="7" className="text-center">
                        Không có người dùng nào khả dụng.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex justify-end mt-4">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Trước
                </Button>
                <span className="mx-4">
                  Trang {page} trên {totalPages}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Kế tiếp
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
