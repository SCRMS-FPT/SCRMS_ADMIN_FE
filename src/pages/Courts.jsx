import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/ui/StatusBadge";
import { useCourts } from "@/hooks/useCourts";

const Courts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { courts, isLoading } = useCourts();

  // Filter courts by search term
  const filteredCourts = searchTerm
    ? courts.filter(
        (court) =>
          court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          court.cluster.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Tìm tên sân..."
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Open">Mở</SelectItem>
              <SelectItem value="Closed">Đóng</SelectItem>
              <SelectItem value="Maintenance">Bảo trì</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Tạo sân</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo sân mới</DialogTitle>
              <DialogDescription>
                Tạo sân với các chi tiết được liệt kê.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="court-name">Tên Sân</Label>
                <Input id="court-name" placeholder="Nhập tên sân" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sportId">Môn thể thao</Label>
                <Select>
                  <SelectTrigger id="sportId">
                    <SelectValue placeholder="Chọn môn thể thao" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Mở</SelectItem>
                    <SelectItem value="Closed">Đóng</SelectItem>
                    <SelectItem value="Maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sportCenterId">Cụm Sân</Label>
                <Input id="sportCenterId" placeholder="Nhập tên cụm sân" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Địa Chỉ</Label>
                <Textarea id="address" placeholder="Nhập địa chỉ đầy đủ" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="court-status">Status</Label>
                <Select>
                  <SelectTrigger id="court-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Mở</SelectItem>
                    <SelectItem value="Closed">Đóng</SelectItem>
                    <SelectItem value="Maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Hủy</Button>
              <Button>Tạo sân</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên sân</TableHead>
                  <TableHead>Môn thể thao</TableHead>
                  <TableHead>Tên trung tâm thể thao</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourts &&
                Array.isArray(filteredCourts) &&
                filteredCourts.length > 0 ? (
                  filteredCourts.map((court) => (
                    <TableRow key={court.id}>
                      <TableCell className="font-medium">
                        {court.name}
                      </TableCell>
                      <TableCell>{court.cluster}</TableCell>
                      <TableCell>{court.address}</TableCell>
                      <TableCell>
                        <StatusBadge status={court.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                            <DropdownMenuItem>Đổi trạng thái</DropdownMenuItem>
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
                    <TableCell colSpan="5" className="text-center">
                      Không có sân nào khả dụng.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Courts;
