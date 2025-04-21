"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  ImageIcon,
  X,
  Loader2,
  Dumbbell,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

export function CoachEditDialog({ open, onOpenChange, coach, sports, onSave }) {
  const [activeTab, setActiveTab] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const avatarInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Phone: "",
    Bio: "",
    RatePerHour: 0,
    ListSport: [],
    NewAvatar: null,
    NewImages: [],
    ExistingImageUrls: [],
    ImagesToDelete: [],
  });

  useEffect(() => {
    if (coach) {
      setActiveTab("info");
      setFormData({
        FullName: coach.fullName || "",
        Email: coach.email || "",
        Phone: coach.phone || "",
        Bio: coach.bio || "",
        RatePerHour: coach.ratePerHour || 0,
        ListSport: coach.sportIds || [],
        NewAvatar: null,
        NewImages: [],
        ExistingImageUrls: coach.imageUrls || [],
        ImagesToDelete: [],
      });
      setAvatarPreview(coach.avatar || "");
    }
  }, [coach]);

  // Avatar preview
  const [avatarPreview, setAvatarPreview] = useState(coach?.avatar || "");

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle number input change
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }));
  };

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        NewAvatar: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle images change
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        NewImages: [...prev.NewImages, ...files],
      }));
    }
  };

  // Handle image delete
  const handleImageDelete = (url) => {
    setFormData((prev) => ({
      ...prev,
      ExistingImageUrls: prev.ExistingImageUrls.filter((item) => item !== url),
      ImagesToDelete: [...prev.ImagesToDelete, url],
    }));
  };

  // Handle new image delete
  const handleNewImageDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      NewImages: prev.NewImages.filter((_, i) => i !== index),
    }));
  };

  // Handle sport selection
  const handleSportToggle = (sportId) => {
    setFormData((prev) => {
      if (prev.ListSport.includes(sportId)) {
        return {
          ...prev,
          ListSport: prev.ListSport.filter((id) => id !== sportId),
        };
      } else {
        return {
          ...prev,
          ListSport: [...prev.ListSport, sportId],
        };
      }
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Create form data for submission
      const submitData = {
        ...formData,
      };

      // Call the save function
      await onSave(submitData);

      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving coach:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create image previews for new images
  const newImagePreviews = formData.NewImages.map((file, index) => {
    const url = URL.createObjectURL(file);
    return { url, index, isNew: true };
  });

  // Combine existing and new images for display
  const allImages = [
    ...formData.ExistingImageUrls.map((url) => ({ url, isNew: false })),
    ...newImagePreviews,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-violet-500" />
            Chỉnh sửa huấn luyện viên
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin của huấn luyện viên
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Tabs
            defaultValue="info"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="images">Hình ảnh</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4 text-violet-500" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <Avatar
                        className="h-32 w-32 border-4 border-violet-100 cursor-pointer relative group"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <AvatarImage
                          src={avatarPreview}
                          alt={formData.FullName}
                        />
                        <AvatarFallback className="text-3xl bg-violet-100 text-violet-500">
                          {formData.FullName?.substring(0, 2).toUpperCase() ||
                            "HLV"}
                        </AvatarFallback>
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      </Avatar>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-violet-500"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        Thay đổi ảnh đại diện
                      </Button>
                    </div>

                    <div className="md:w-2/3 space-y-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fullName">Họ và tên</Label>
                          <Input
                            id="fullName"
                            name="FullName"
                            value={formData.FullName}
                            onChange={handleInputChange}
                            placeholder="Nhập họ và tên"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex">
                              <Mail className="h-4 w-4 mr-2 self-center text-slate-400" />
                              <Input
                                id="email"
                                name="Email"
                                type="email"
                                value={formData.Email}
                                onChange={handleInputChange}
                                placeholder="Nhập email"
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="Phone">Số điện thoại</Label>
                            <div className="flex">
                              <Phone className="h-4 w-4 mr-2 self-center text-slate-400" />
                              <Input
                                id="Phone"
                                name="Phone"
                                value={formData.Phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="RatePerHour">
                            Giá theo giờ (VNĐ)
                          </Label>
                          <Input
                            id="RatePerHour"
                            name="RatePerHour"
                            type="number"
                            value={formData.RatePerHour}
                            onChange={handleNumberChange}
                            placeholder="Nhập giá theo giờ"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Giới thiệu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.Bio}
                    onChange={handleInputChange}
                    placeholder="Nhập thông tin giới thiệu về huấn luyện viên"
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-violet-500" />
                    Chuyên môn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sports &&
                      sports.map((sport) => (
                        <div
                          key={sport.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`sport-${sport.id}`}
                            checked={formData.ListSport.includes(sport.id)}
                            onCheckedChange={() => handleSportToggle(sport.id)}
                          />
                          <label
                            htmlFor={`sport-${sport.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {sport.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-violet-500" />
                    Thư viện ảnh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-8 cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => imagesInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-slate-400" />
                        <p className="mt-2 text-sm text-slate-600">
                          Nhấp để tải lên hình ảnh
                        </p>
                        <p className="text-xs text-slate-400">
                          PNG, JPG, JPEG (tối đa 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={imagesInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                      />
                    </div>

                    {allImages.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {allImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative group rounded-md overflow-hidden border border-slate-200"
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Ảnh ${index + 1}`}
                              className="w-full aspect-square object-cover"
                            />
                            <button
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() =>
                                image.isNew
                                  ? handleNewImageDelete(image.index)
                                  : handleImageDelete(image.url)
                              }
                              type="button"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {image.isNew && (
                              <div className="absolute bottom-0 left-0 right-0 bg-violet-500 text-white text-xs py-1 px-2 text-center">
                                Ảnh mới
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        Chưa có hình ảnh nào. Hãy tải lên hình ảnh đầu tiên.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
