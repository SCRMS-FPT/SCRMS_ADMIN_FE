"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Mail,
  Package,
  Phone,
  User,
  Dumbbell,
  FileText,
  DollarSign,
  ImageIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CoachViewDialog({ open, onOpenChange, coach, sports }) {
  const [activeTab, setActiveTab] = useState("info");

  if (!coach) return null;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Get sport names from IDs
  const getSportNames = () => {
    if (!sports || !coach.sportIds) return [];
    return coach.sportIds.map((id) => {
      const sport = sports.find((s) => s.id === id);
      return sport ? sport.name : "Unknown";
    });
  };

  // Format day name in Vietnamese
  const formatDayName = (dayName) => {
    const days = {
      Sunday: "Chủ nhật",
      Monday: "Thứ hai",
      Tuesday: "Thứ ba",
      Wednesday: "Thứ tư",
      Thursday: "Thứ năm",
      Friday: "Thứ sáu",
      Saturday: "Thứ bảy",
    };
    return days[dayName] || dayName;
  };

  // Format time (remove seconds)
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-violet-500" />
            Thông tin huấn luyện viên
          </DialogTitle>
          <DialogDescription>
            Xem chi tiết thông tin của huấn luyện viên
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 py-4 w-full">
          <div className="md:w-1/3 space-y-4">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 border-4 border-violet-100">
                <AvatarImage src={coach.avatar} alt={coach.fullName} />
                <AvatarFallback className="text-3xl bg-violet-100 text-violet-500">
                  {coach.fullName?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-bold text-slate-800">
                {coach.fullName}
              </h3>
              <div className="flex items-center mt-1 text-slate-500">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{formatCurrency(coach.ratePerHour)}/giờ</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 justify-center">
                {getSportNames().map((sport, index) => (
                  <Badge key={index} variant="outline" className="bg-violet-50">
                    <Dumbbell className="h-3 w-3 mr-1" />
                    {sport}
                  </Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{coach.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-slate-400" />
                  <span>{coach.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                  <span>
                    Tham gia: {format(new Date(coach.createdAt), "dd/MM/yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs
              defaultValue="info"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="packages">Gói tập</TabsTrigger>
                <TabsTrigger value="schedule">Lịch trình</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-violet-500" />
                      Giới thiệu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 whitespace-pre-line">
                      {coach.bio || "Không có thông tin giới thiệu."}
                    </p>
                  </CardContent>
                </Card>

                {coach.imageUrls && coach.imageUrls.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-violet-500" />
                        Thư viện ảnh
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Carousel className="w-full">
                        <CarouselContent>
                          {coach.imageUrls.map((url, index) => (
                            <CarouselItem
                              key={index}
                              className="basis-full md:basis-1/2 lg:basis-1/3"
                            >
                              <div className="p-1">
                                <img
                                  src={url || "/placeholder.svg"}
                                  alt={`${coach.fullName} - ảnh ${index + 1}`}
                                  className="rounded-md object-cover w-full aspect-square"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="packages" className="space-y-4">
                {coach.packages && coach.packages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coach.packages.map((pkg, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden border-t-4 border-t-violet-400"
                      >
                        <CardHeader className="bg-gradient-to-r from-violet-50 to-white pb-2">
                          <CardTitle className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-violet-500" />
                            {pkg.name}
                          </CardTitle>
                          <CardDescription>
                            {pkg.sessionCount} buổi tập
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-slate-700">{pkg.description}</p>
                          <div className="font-bold text-lg text-violet-600">
                            {formatCurrency(pkg.price)}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-slate-500">
                      Huấn luyện viên này chưa có gói tập nào.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                {coach.weeklySchedule && coach.weeklySchedule.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-violet-500" />
                        Lịch trình hàng tuần
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {coach.weeklySchedule
                          .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                          .map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-md border border-slate-200 bg-slate-50"
                            >
                              <div className="font-medium">
                                {formatDayName(schedule.dayName)}
                              </div>
                              <div className="flex items-center text-slate-600">
                                <Clock className="h-4 w-4 mr-1 text-violet-400" />
                                {formatTime(schedule.startTime)} -{" "}
                                {formatTime(schedule.endTime)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-slate-500">
                      Huấn luyện viên này chưa có lịch trình hàng tuần.
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
