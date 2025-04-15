import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, redirect } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  MapPin,
  Tag,
  Clock,
  Trash2,
  Plus,
  XCircle,
  Info,
  ImagePlus,
  Calendar,
  AlertTriangle,
  Loader,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  getDetails,
  useDeleteSportCenter,
  useDeleteCourt,
} from "@/hooks/useSportCenter";
import { showToast, logoutUser } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { listProvinces, showAllDivisions } from "@/api/vnPublicAPI";
import { StatusPopup } from "@/components/ui/status-popup";

const formatTime = (timeSpan) => {
  const [hours, minutes] = timeSpan.split(":");
  if (hours === "00") return `${minutes} phút`;
  if (hours === "01") return `${hours} giờ`;
  return `${hours} giờ ${minutes === "00" ? "" : `${minutes} phút`}`;
};

// Custom format for date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SportCenterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeTabForm, setActiveTabForm] = useState("basic");
  const [selectedImage, setSelectedImage] = useState(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateCourtDialogOpen, setIsCreateCourtDialogOpen] = useState(false);
  const { isLoading, centerDetail, error } = getDetails(id);
  const [customFacilities, setCustomFacilities] = useState([]);
  const [division, setDivision] = useState([]);
  const [currentProvince, setCurrentProvince] = useState(null);
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentWard, setCurrentWard] = useState(null);
  const [courtToDelete, setCourtToDelete] = useState(null);
  const [editingCourt, setEditingCourt] = useState(null);
  const [deleteCenter, setDeleteCenter] = useState(null);
  const [deleteCourt, setDeleteCourt] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const addFacility = () => {
    setCustomFacilities([...customFacilities, { name: "", description: "" }]);
  };

  useEffect(() => {
    showAllDivisions(3).then(setDivision);
  }, []);
  const updateFacility = (index, field, value) => {
    const updatedFacilities = [...customFacilities];
    updatedFacilities[index][field] = value;
    setCustomFacilities(updatedFacilities);
  };

  const removeFacility = (index) => {
    setCustomFacilities(customFacilities.filter((_, i) => i !== index));
  };

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

  const courtsBySport = (centerDetail.courts || []).reduce((acc, court) => {
    if (!acc[court.sportName]) {
      acc[court.sportName] = [];
    }
    acc[court.sportName].push(court);
    return acc;
  }, {});

  const openCourtDialog = (court = null) => {
    setEditingCourt(court);
    setIsCreateCourtDialogOpen(true);
  };

  const closeCourtCreateDialog = () => {
    setCustomFacilities([]);
    setEditingCourt(null);
    setIsCreateCourtDialogOpen(false);
  };

  const handleSaveCourt = () => {
    if (editingCourt) {
      console.log("Updating court:", editingCourt);
    } else {
      console.log("Creating new court");
    }
    closeCourtCreateDialog();
  };

  const getCourtTypeText = (type) => {
    switch (type) {
      case 3:
        return "có che";
      case 2:
        return "trong nhà";
      default:
        return "ngoài trời";
    }
  };

  const handleDeleteCourt = async (courtId) => {
    try {
      setIsSending(true);
      await useDeleteCourt(courtId);
      setIsSending(false);
      const response = {
        status: "success",
        showStatus: true,
        message: "Xóa sân thành công",
      };
      setDeleteCourt(response);
    } catch (error) {
      setIsSending(false);
      const err = {
        status: "error",
        showStatus: true,
        message: "Xóa sân thất bại",
      };
      setDeleteCourt(err);
    }
  };

  const tryDeleteSportCenter = async () => {
    try {
      setIsSending(true);
      await useDeleteSportCenter(id);
      setIsSending(false);
      const response = {
        status: "success",
        showStatus: true,
        message: "Xóa cụm sân thành công",
      };
      setDeleteCenter(response);
    } catch (error) {
      setIsSending(false);
      const err = {
        status: "error",
        showStatus: true,
        message: "Xóa cụm sân thất bại",
      };
      setDeleteCenter(err);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {isLoading || isSending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center">
            <Loader className="h-12 w-12 text-white animate-spin" />
            <p className="text-white mt-4">Đang xử lý...</p>
          </div>
        </div>
      ) : // <p className="text-center text-muted-foreground">Đang tải...</p>
      centerDetail ? (
        <>
          {/* Popup for delete sport center */}
          <StatusPopup
            isOpen={deleteCenter?.showStatus || false}
            type={deleteCenter?.status || "error"}
            message={deleteCenter?.message || "Your action was completed fail!"}
            closeText="Đóng"
            onClose={() => {
              if (deleteCenter.status == "success") {
                redirect("/sport-centers");
              }
              setDeleteCenter(null);
            }}
            autoCloseTime={5000}
          />

          <StatusPopup
            isOpen={deleteCourt?.showStatus || false}
            type={deleteCourt?.status || "error"}
            message={deleteCourt?.message || "Your action was completed fail!"}
            closeText="Đóng"
            onClose={() => {
              if (deleteCourt.status == "success") {
                window.location.reload();
              }
              setDeleteCourt(null);
            }}
            autoCloseTime={5000}
          />

          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay trở lại trang thông
              tin
            </Button>
            <div className="flex gap-2">
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  {/* <Button
                    variant="outline"
                    className="transition-all hover:bg-primary/10"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                  </Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] max-h-[100vh] p-0 overflow-hidden">
                  <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle className="text-xl font-semibold flex items-center">
                      <Info className="mr-2 h-5 w-5 text-primary" />
                      Sửa thông tin cụm sân
                    </DialogTitle>
                    <DialogDescription>
                      Chỉnh sửa thông tin cơ bản của cụm sân
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs
                    defaultValue="basic"
                    className="w-full"
                    value={activeTabForm}
                    onValueChange={setActiveTabForm}
                  >
                    <div className="px-6">
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="basic">
                          Thông tin cơ bản
                        </TabsTrigger>
                        <TabsTrigger value="location">Địa chỉ</TabsTrigger>
                        <TabsTrigger value="details">Hình ảnh</TabsTrigger>
                      </TabsList>
                    </div>

                    <div
                      className="overflow-y-auto px-6 pb-6"
                      style={{ maxHeight: "calc(85vh - 180px)" }}
                    >
                      <TabsContent value="basic" className="mt-0 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="font-medium">
                              Tên
                            </Label>
                            <Input
                              id="name"
                              defaultValue={centerDetail.name}
                              className="transition-all focus-visible:ring-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="font-medium">
                              Số điện thoại
                            </Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                defaultValue={centerDetail.phoneNumber}
                                className="pl-10 transition-all focus-visible:ring-primary"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description" className="font-medium">
                            Mô tả
                          </Label>
                          <Textarea
                            id="description"
                            defaultValue={centerDetail.description}
                            className="min-h-[120px] transition-all focus-visible:ring-primary"
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="location" className="mt-0 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="font-medium">
                            Tỉnh/Thành Phố
                          </Label>
                          <Select
                            defaultValue={centerDetail.city}
                            onValueChange={(e) => {
                              const selectedProvince = division.find(
                                (province) => province.code === e
                              );
                              setCurrentProvince(selectedProvince);
                            }}
                          >
                            <SelectTrigger
                              id="city"
                              className="transition-all focus:ring-primary w-52"
                            >
                              <SelectValue placeholder="Chọn Tỉnh/Thành Phố" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {division.map((province) => (
                                <SelectItem
                                  key={province.name}
                                  value={province.code}
                                >
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="district" className="font-medium">
                            Quận/Huyện
                          </Label>
                          <Select
                            defaultValue={centerDetail.district}
                            onValueChange={(e) => {
                              const selectedDistrict =
                                currentProvince?.districts.find(
                                  (district) => district.code === e
                                );
                              setCurrentDistrict(selectedDistrict);
                            }}
                            disabled={!currentProvince}
                          >
                            <SelectTrigger
                              id="district"
                              className="transition-all focus:ring-primary w-52"
                            >
                              <SelectValue placeholder="Chọn Quận/Huyện" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {currentProvince ? (
                                currentProvince.districts.map((district) => (
                                  <SelectItem
                                    key={district.code}
                                    value={district.code}
                                  >
                                    {district.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none">
                                  Chọn Tỉnh/Thành Phố trước
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="commune" className="font-medium">
                            Xã/Phường
                          </Label>
                          <Select
                            defaultValue={centerDetail.commune}
                            onValueChange={(e) => setCurrentWard(e)}
                            disabled={!currentDistrict}
                          >
                            <SelectTrigger
                              id="commune"
                              className="transition-all focus:ring-primary w-52"
                            >
                              <SelectValue placeholder="Chọn Xã/Phường" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px]">
                              {currentDistrict ? (
                                currentDistrict.wards.map((ward) => (
                                  <SelectItem key={ward.code} value={ward.code}>
                                    {ward.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="none">
                                  Chọn Quận/Huyện trước
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address" className="font-medium">
                            Địa chỉ chi tiết
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="address"
                              defaultValue={centerDetail.addressLine}
                              className="pl-10 transition-all focus-visible:ring-primary"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="mt-0 space-y-6">
                        <Card className="border-dashed">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="font-medium flex items-center">
                                <ImagePlus className="mr-2 h-4 w-4 text-primary" />
                                Ảnh đại diện
                              </Label>
                            </div>

                            <div className="flex flex-col items-center gap-4">
                              <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/20">
                                  {centerDetail.avatar ? (
                                    <img
                                      src={
                                        centerDetail.avatar ||
                                        "/placeholder.svg"
                                      }
                                      alt="Avatar"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                      <ImagePlus className="h-10 w-10 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="bg-white text-black hover:bg-white/90"
                                  >
                                    <ImagePlus className="h-4 w-4 mr-2" />
                                    Chọn ảnh
                                  </Button>
                                </div>
                              </div>

                              <div className="text-center space-y-1">
                                <p className="text-sm text-muted-foreground">
                                  Tải lên ảnh đại diện cho cụm sân
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Kích thước đề xuất: 256x256 pixels
                                </p>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 transition-all hover:bg-primary/10"
                                >
                                  <ImagePlus className="h-3 w-3 mr-1" /> Tải ảnh
                                  lên
                                </Button>
                                {centerDetail.avatar && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 transition-all hover:bg-destructive/10 text-destructive"
                                  >
                                    <XCircle className="h-3 w-3 mr-1" /> Xóa ảnh
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium flex items-center">
                              <ImagePlus className="mr-2 h-4 w-4 text-primary" />
                              Hình ảnh cụ thể
                            </Label>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 transition-all hover:bg-primary/10"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Thêm ảnh
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            {centerDetail.imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="group relative aspect-square rounded-md overflow-hidden border"
                              >
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`Sport center image ${index + 1}`}
                                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button className="bg-red-500 text-white rounded-full p-1.5 transform scale-90 hover:scale-100 transition-transform">
                                    <XCircle className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <div className="flex items-center justify-center aspect-square rounded-md border border-dashed hover:border-primary/50 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                                <ImagePlus className="h-8 w-8 mb-2" />
                                <span className="text-xs">Thêm ảnh</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>

                  <DialogFooter className="px-6 py-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="transition-all hover:bg-muted"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={() => setIsEditDialogOpen(false)}
                      className="transition-all"
                    >
                      Lưu thay đổi
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="transition-all hover:bg-destructive/90"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Xóa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[450px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">
                      Bạn có chắc chắn?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh
                      viễn cụm sân và tất cả các sân và dữ liệu liên quan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel className="transition-all hover:bg-muted">
                      Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        tryDeleteSportCenter();
                      }}
                      className="bg-destructive text-destructive-foreground transition-all hover:bg-destructive/90"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Xóa vĩnh viễn
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={
                    centerDetail.imageUrls[selectedImage] || "/placeholder.svg"
                  }
                  alt={centerDetail.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {centerDetail.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    className={`relative h-16 w-24 rounded-md overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={centerDetail.avatar}
                        alt={centerDetail.name}
                      />
                      <AvatarFallback>
                        {centerDetail.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{centerDetail.name}</CardTitle>
                      <CardDescription>Cụm sân thể thao</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{centerDetail.phoneNumber}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                    <span>{centerDetail.addressLine}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="courts">Các sân</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Về cụm sân thể thao</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {centerDetail.description
                      ? centerDetail.description
                      : "Sân này không cung cấp thông tin gì"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courts Tab */}
            <TabsContent value="courts" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Tổng thể các sân</h2>
                {/* <Button onClick={() => openCourtDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Thêm sân
                </Button> */}
                <Dialog
                  open={isCreateCourtDialogOpen}
                  onOpenChange={setIsCreateCourtDialogOpen}
                >
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        const formData = new FormData(e.target); // Collect all form data
                        const courtData = Object.fromEntries(
                          formData.entries()
                        ); // Convert to object
                        console.log("Form Data:", courtData);

                        if (editingCourt) {
                          console.log("Updating court:", courtData);
                          // Add logic to update the court
                        } else {
                          console.log("Creating new court:", courtData);
                          // Add logic to create a new court
                        }
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>
                          {editingCourt ? "Chỉnh sửa sân" : "Tạo sân mới"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingCourt
                            ? "Chỉnh sửa thông tin sân hiện tại"
                            : "Thêm một sân vào cụm sân hiện tại"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="courtName">Tên sân</Label>
                            <Input
                              id="courtName"
                              name="courtName"
                              placeholder="Nhập tên sân"
                              defaultValue={editingCourt?.courtName || ""}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sportType">Loại môn thể thao</Label>
                            <Select
                              name="sportType"
                              defaultValue={editingCourt?.sportId || ""}
                            >
                              <SelectTrigger id="sportId">
                                <SelectValue placeholder="Chọn môn thể thao" />
                              </SelectTrigger>
                              <SelectContent>
                                {centerDetail.sports.map((sport) => (
                                  <SelectItem key={sport.id} value={sport.id}>
                                    {sport.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="courtDescription">Mô tả</Label>
                          <Textarea
                            id="courtDescription"
                            name="courtDescription"
                            placeholder="Nhập mô tả sân"
                            defaultValue={editingCourt?.description || ""}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="courtType">Loại sân</Label>
                            <Select
                              defaultValue={
                                editingCourt
                                  ? String(editingCourt.courtType)
                                  : ""
                              }
                              name="courtType"
                            >
                              <SelectTrigger id="courtType">
                                <SelectValue placeholder="Chọn loại sân" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Trong nhà</SelectItem>
                                <SelectItem value="2">Ngoài trời</SelectItem>
                                <SelectItem value="3">Có mái che</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Trạng thái</Label>
                            <Select
                              defaultValue={
                                editingCourt ? String(editingCourt.status) : ""
                              }
                              name="status"
                            >
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">Đang mở</SelectItem>
                                <SelectItem value="1">Đã đóng</SelectItem>
                                <SelectItem value="2">Bảo trì</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="slotDuration">
                              Thời gian đặt sân
                            </Label>
                            <Select
                              defaultValue={editingCourt?.slotDuration || ""}
                              name="slotDuration"
                            >
                              <SelectTrigger id="slotDuration">
                                <SelectValue placeholder="Chọn thời gian" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="00:30:00">
                                  30 phút
                                </SelectItem>
                                <SelectItem value="01:00:00">1 giờ</SelectItem>
                                <SelectItem value="01:30:00">
                                  1.5 giờ
                                </SelectItem>
                                <SelectItem value="02:00:00">2 giờ</SelectItem>
                                <SelectItem value="02:30:00">
                                  2.5 giờ
                                </SelectItem>
                                <SelectItem value="03:00:00">3 giờ</SelectItem>
                                <SelectItem value="03:30:00">
                                  3.5 giờ
                                </SelectItem>
                                <SelectItem value="04:00:00">4 giờ</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="minDeposit">
                              Đặt cọc tối thiểu (%)
                            </Label>
                            <Input
                              id="minDeposit"
                              name="minDeposit"
                              type="number"
                              min="0"
                              max="100"
                              defaultValue={
                                editingCourt
                                  ? editingCourt.minDepositPercentage
                                  : "20"
                              }
                              placeholder="Nhập % đặt cọc"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Tiện ích</Label>
                          <div className="border rounded-md p-4">
                            <div className="space-y-2">
                              {[
                                {
                                  name: "Sáng",
                                  description: "Hệ thống chiếu sáng đầy đủ",
                                },
                                {
                                  name: "Ghế ngồi",
                                  description: "Ghế ngồi thoải mái",
                                },
                                {
                                  name: "Dụng cụ thể thao",
                                  description: "Cho thuê dụng cụ thể thao",
                                },
                                {
                                  name: "Water Station",
                                  description: "Trạm nước uống miễn phí",
                                },
                                {
                                  name: "Locker Room",
                                  description: "Phòng thay đồ tiện nghi",
                                },
                              ].map((facility) => (
                                <Tooltip key={facility.name}>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        id={`facility-${facility.name}`}
                                        className="h-4 w-4"
                                      />
                                      <Label
                                        htmlFor={`facility-${facility.name}`}
                                      >
                                        {facility.name}
                                      </Label>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    align="start"
                                    className="text-sm"
                                  >
                                    {facility.description}
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                            {customFacilities.map((facility, index) => (
                              <div
                                key={index}
                                className="flex gap-2 items-center mt-2"
                              >
                                <Input
                                  placeholder="Facility Name"
                                  value={facility.name}
                                  onChange={(e) =>
                                    updateFacility(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                                <Input
                                  placeholder="Description"
                                  value={facility.description}
                                  onChange={(e) =>
                                    updateFacility(
                                      index,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                />
                                <button
                                  onClick={() => removeFacility(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            ))}

                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={addFacility}
                            >
                              <Plus className="h-3 w-3 mr-1" /> Thêm tiện ích
                              tùy chỉnh
                            </Button>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => closeCourtCreateDialog()}
                        >
                          Hủy
                        </Button>
                        <Button type="submit">
                          {editingCourt ? "Lưu thay đổi" : "Tạo mới"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {courtsBySport.length < 0 ? (
                <p>Không có bất kì sân nào</p>
              ) : (
                Object.entries(courtsBySport).map(([sport, sportCourts]) => (
                  <div
                    key={sport}
                    className="space-y-5 animate-in fade-in duration-500"
                  >
                    <h3 className="text-xl font-semibold flex items-center bg-gradient-to-r from-primary/80 to-primary p-2 rounded-lg text-primary-foreground shadow-sm">
                      <Tag className="mr-2 h-5 w-5" />
                      <span>Sân {sport}</span>
                    </h3>

                    {/* Courts Grid */}
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                      {sportCourts.map((court) => (
                        <Card
                          key={court.id}
                          className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group"
                        >
                          {/* Card Header */}
                          <CardHeader className="pb-2 pt-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                  {court.courtName}
                                </CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                  <span className="mr-1">
                                    Sân {getCourtTypeText(court.courtType)}
                                  </span>
                                </CardDescription>
                              </div>
                              <StatusBadge status={court.status} />
                            </div>
                          </CardHeader>

                          {/* Card Content */}
                          <CardContent className="space-y-4">
                            {court.description && (
                              <p className="text-sm text-muted-foreground border-l-2 border-primary/20 pl-2 italic">
                                {court.description}
                              </p>
                            )}

                            <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                              <Clock className="mr-2 h-4 w-4 text-primary" />
                              <span>
                                Thời gian một buổi:{" "}
                                <span className="font-medium">
                                  {formatTime(court.slotDuration)}
                                </span>
                              </span>
                            </div>

                            {/* Facilities Section */}
                            {court.facilities &&
                              court.facilities.length > 0 && (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold flex items-center">
                                    <Info className="mr-1 h-3.5 w-3.5 text-blue-600" />
                                    Tiện nghi:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {court.facilities.map((facility) => (
                                      <Tooltip key={facility.name}>
                                        <TooltipTrigger asChild>
                                          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-1 rounded shadow-sm hover:shadow-md transition duration-200 cursor-pointer">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-4 w-4"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                            <span className="text-xs font-medium">
                                              {facility.name}
                                            </span>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          align="center"
                                          className="text-xs font-light"
                                        >
                                          {facility.description}
                                        </TooltipContent>
                                      </Tooltip>
                                    ))}
                                  </div>
                                </div>
                              )}

                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="mr-1 h-3 w-3 text-primary/70" />
                              <span>
                                Ngày tạo: {formatDate(court.createdAt)}
                              </span>
                            </div>
                          </CardContent>

                          {/* Card Footer */}
                          <CardFooter className="flex justify-between pt-2 gap-2">
                            {/* <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 hover:bg-primary/10 hover:text-primary transition-colors"
                              onClick={() => openCourtDialog(court)}
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Chỉnh sửa
                            </Button> */}
                            <AlertDialog
                              open={courtToDelete === court.id}
                              onOpenChange={(open) =>
                                !open && setCourtToDelete(null)
                              }
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1 opacity-80 hover:opacity-100 transition-opacity"
                                  onClick={() => setCourtToDelete(court.id)}
                                >
                                  <Trash2 className="mr-1 h-3 w-3" /> Xóa
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center text-destructive">
                                    <AlertTriangle className="mr-2 h-5 w-5" />
                                    Xác nhận xóa sân
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="space-y-2">
                                    <p>
                                      Bạn có chắc chắn muốn xóa sân{" "}
                                      <strong>{court.courtName}</strong>?
                                    </p>
                                    <p className="font-medium">
                                      Hành động này không thể hoàn tác. Tất cả
                                      dữ liệu liên quan đến sân này sẽ bị xóa
                                      vĩnh viễn.
                                    </p>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    onClick={() => handleDeleteCourt(court.id)}
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">
            Không có trung tâm thể thao nào ở đây.
          </p>
        </div>
      )}
    </div>
  );
};

export default SportCenterDetailPage;
