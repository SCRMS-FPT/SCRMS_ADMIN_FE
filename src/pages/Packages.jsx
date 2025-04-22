import { useState, useEffect } from "react";
import { Card, Skeleton, Switch, Popconfirm, message, Badge } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paper,
  TextField,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Button as ShadcnButton } from "../components/ui/button";
import {
  Client,
  CreateServicePackageRequest,
  UpdateServicePackageRequest,
} from "../api/IdentityApi";
import { formatCurrency, showToast, logoutUser } from "../lib/utils";

const ITEMS_PER_PAGE = 6;
const API_CLIENT = new Client();

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    durationDays: 30,
    associatedRole: "sportcoach",
    status: "active",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Fetch packages from API
  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const statusFilter = activeTab !== "all" ? activeTab : "";

      const response = await API_CLIENT.servicePackages(
        currentPage - 1, // API is 0-indexed
        ITEMS_PER_PAGE,
        searchTerm,
        "", // associatedRole
        statusFilter, // status
        "" // sortByPrice
      );

      // Assuming response has the format { data: [...packages], totalCount: number, totalPages: number }
      setPackages(response.data || []);
      setTotalPages(response.totalPages || 1);
      setIsLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải danh sách gói dịch vụ:", err);
      setError(err);
      setIsLoading(false);

      if (err.status === 401) {
        logoutUser();
      } else {
        showToast(
          `Lỗi: ${err.message || "Không thể tải danh sách gói dịch vụ"}`,
          "error"
        );
      }
    }
  };

  // Handle errors
  useEffect(() => {
    if (error) {
      if (error.status === 401) {
        logoutUser();
      } else {
        showToast(`Lỗi: ${error.message}`, "error");
      }
    }
  }, [error]);

  // Load packages on initial render and when dependencies change
  useEffect(() => {
    fetchPackages();
  }, [currentPage, searchTerm, activeTab]);

  // Reset form data when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen && selectedPackage) {
      setFormData({
        name: selectedPackage.name || "",
        description: selectedPackage.description || "",
        price: selectedPackage.price || 0,
        durationDays: selectedPackage.durationDays || 30,
        associatedRole: selectedPackage.associatedRole || "sportcoach",
        status: selectedPackage.status || "active",
      });
    } else if (isDialogOpen && !selectedPackage) {
      // Reset form for new package
      setFormData({
        name: "",
        description: "",
        price: 0,
        durationDays: 30,
        associatedRole: "sportcoach",
        status: "active",
      });
    }
  }, [isDialogOpen, selectedPackage]);

  // Dialog handlers
  const openDialog = (pkg = null) => {
    setSelectedPackage(pkg);
    setFormErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedPackage(null);
    setFormErrors({});
  };

  // Form input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Tên gói dịch vụ không được để trống";
    }

    if (!formData.description.trim()) {
      errors.description = "Mô tả không được để trống";
    }

    if (formData.price <= 0) {
      errors.price = "Giá phải lớn hơn 0";
    }

    if (formData.durationDays <= 0) {
      errors.durationDays = "Thời hạn phải lớn hơn 0";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (selectedPackage) {
        // Update existing package
        const updateRequest = new UpdateServicePackageRequest({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          associatedRole: formData.associatedRole,
          status: formData.status,
          durationDays: parseInt(formData.durationDays),
        });

        await API_CLIENT.update(selectedPackage.id, updateRequest);
        showToast(
          `Gói dịch vụ "${formData.name}" đã được cập nhật thành công`,
          "success"
        );
      } else {
        // Create new package
        const createRequest = new CreateServicePackageRequest({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          associatedRole: formData.associatedRole,
          status: formData.status,
          durationDays: parseInt(formData.durationDays),
        });

        await API_CLIENT.create(createRequest);
        showToast(
          `Gói dịch vụ "${formData.name}" đã được tạo thành công`,
          "success"
        );
      }

      closeDialog();
      fetchPackages(); // Refresh the list
    } catch (err) {
      console.error("Lỗi khi lưu gói dịch vụ:", err);
      showToast(`Lỗi: ${err.message || "Không thể lưu gói dịch vụ"}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDelete = async (id) => {
    setIsDeleting(true);
    setDeleteItemId(id);

    try {
      await API_CLIENT.delete(id);
      showToast("Gói dịch vụ đã được xóa thành công", "success");
      fetchPackages(); // Refresh the list
    } catch (err) {
      console.error("Lỗi khi xóa gói dịch vụ:", err);
      showToast(`Lỗi: ${err.message || "Không thể xóa gói dịch vụ"}`, "error");
    } finally {
      setIsDeleting(false);
      setDeleteItemId(null);
    }
  };

  // Function to get role name in Vietnamese
  const getRoleName = (role) => {
    switch (role) {
      case "sportcoach":
        return "Huấn luyện viên";
      case "sportcenter":
        return "Trung tâm thể thao";
      case "player":
        return "Người chơi";
      default:
        return role;
    }
  };

  // Package card component with animations
  const PackageCard = ({ pkg }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
      className="relative"
    >
      <Card
        className="h-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:border-blue-300 transition-all duration-200"
        cover={
          <div
            className={`h-28 relative overflow-hidden ${
              pkg.status === "active"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600"
                : "bg-gradient-to-r from-gray-500 to-gray-600"
            }`}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtMS4zNiAwLTIuNTk4LS41NjItMy40ODQtMS40NjhDMzEuNjMgMTUuNjI0IDMxLjA2OSAxNC40IDMxLjA2OSAxM2MwLTEuNDIyLjU2My0yLjY0NyAxLjQ2OC0zLjUzMkMzMy40MjMgOC41NjIgMzQuNjQgOCAzNiA4YzEuMzc1IDAgMi41OTkuNTYyIDMuNDg0IDEuNDY4Ljg5MS44ODUgMS40NTMgMi4xMSAxLjQ1MyAzLjUzMiAwIDEuNC0uNTYyIDIuNjI0LTEuNDUzIDMuNTMyQTQuOTYgNC45NiAwIDAgMSAzNiAxOHpNMTggMzZjMC0xLjM5OC0uNTYyLTIuNjMtMS40NTMtMy41MTVBNC45NjEgNC45NjEgMCAwIDAgMTMuMDYzIDMxYTQuOTYgNC45NiAwIDAgMC0zLjQ4NCAxLjQ4NUM4LjY3NyAzMy4zNyA4LjEyNSAzNC42MDIgOC4xMjUgMzZjMCAxLjM3NS41NTIgMi42MDkgMS40NTQgMy41MTRBNC45NjEgNC45NjEgMCAwIDAgMTMuMDYzIDQxYy45OTkgMCAyLjEwMS0uMTc1IDMuNDg0LTEuNDg2Ljg5MS0uOTA1IDEuNDUzLTIuMTM5IDEuNDUzLTMuNTE0ek01MyAzNmMwLS4wNTIgMi4xMjEtLjg3OUMyNC42NjIgMjUuNTggMjUgMjQuODI0IDI1IDI0ek0yNSA0N2MwLS44MjQtLjMzOC0xLjU4LS44NzktMi4xMjFTMjIuODI0IDQ0IDIyIDQ0cy0xLjU4LjMzOC0yLjEyMS44NzlTMTkgNDYuMTc2IDE5IDQ3YzAgLjgyNC4zMzggMS41OC44NzkgMi4xMjFTMjEuMTc2IDUwIDIyIDUwcy0uMTU4LS4wNTIgMi4xMjEtLjg3OUMyNC42NjIgNDguNTggMjUgNDcuODI0IDI1IDQ3eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMjUiLz48L2c+PC9zdmc+')] opacity-10"></div>
            <div className="flex items-center justify-center h-full relative">
              <h3 className="text-white text-2xl font-bold">
                {formatCurrency(pkg.price)}
              </h3>
              <div className="absolute top-2 right-2">
                <Badge
                  status={pkg.status === "active" ? "success" : "default"}
                  text={
                    <span className="text-white text-xs font-medium">
                      {pkg.status === "active" ? "Hoạt động" : "Tạm dừng"}
                    </span>
                  }
                />
              </div>
            </div>
          </div>
        }
        actions={[
          <TooltipProvider key="edit">
            <ShadcnTooltip>
              <TooltipTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 hover:text-blue-700 transition-colors p-2 flex items-center justify-center"
                  onClick={() => openDialog(pkg)}
                >
                  <Icon icon="lucide:edit" className="w-5 h-5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa gói dịch vụ</p>
              </TooltipContent>
            </ShadcnTooltip>
          </TooltipProvider>,
          <Popconfirm
            key="delete"
            title="Xóa gói dịch vụ này?"
            description="Hành động này không thể hoàn tác"
            onConfirm={() => handleDelete(pkg.id)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <TooltipProvider>
              <ShadcnTooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 flex items-center justify-center"
                    disabled={isDeleting && deleteItemId === pkg.id}
                  >
                    {isDeleting && deleteItemId === pkg.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Icon icon="lucide:trash-2" className="w-5 h-5" />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xóa gói dịch vụ</p>
                </TooltipContent>
              </ShadcnTooltip>
            </TooltipProvider>
          </Popconfirm>,
        ]}
      >
        <div className="px-4 py-3 h-48 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {pkg.name}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-1">
            {pkg.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <Chip
              label={getRoleName(pkg.associatedRole)}
              color="primary"
              variant="outlined"
              size="small"
              className="bg-blue-50"
            />
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Icon icon="lucide:calendar" className="w-4 h-4" />
              <span>
                {pkg.durationDays} {pkg.durationDays === 1 ? "ngày" : "ngày"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Skeleton loader for cards
  const SkeletonCard = () => (
    <Card className="h-full shadow-md rounded-lg overflow-hidden border border-gray-100">
      <div className="h-28 bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3 h-48">
        <Skeleton.Input style={{ width: "70%" }} active />
        <Skeleton active paragraph={{ rows: 2 }} />
        <div className="flex justify-between mt-4">
          <Skeleton.Button active size="small" />
          <Skeleton.Input style={{ width: "30%" }} active />
        </div>
      </div>
      <div className="flex justify-between px-4 py-2 border-t border-gray-100">
        <Skeleton.Button active size="small" />
        <Skeleton.Button active size="small" />
      </div>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <Paper className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-800 mb-1"
          >
            Quản lý gói dịch vụ
          </Typography>
          <Typography variant="body1" className="text-gray-500">
            Tạo và quản lý các gói dịch vụ cho người dùng của bạn
          </Typography>
        </Box>

        {/* Header with search and add button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-1/3 relative">
            <TextField
              fullWidth
              placeholder="Tìm kiếm gói dịch vụ..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <Icon icon="lucide:search" className="mr-2 text-gray-400" />
                ),
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400"
                  >
                    <Icon icon="lucide:x" className="w-4 h-4" />
                  </IconButton>
                ),
                className:
                  "bg-gray-50 hover:bg-white transition-colors duration-200",
              }}
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Icon icon="lucide:plus" />}
              onClick={() => openDialog()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 min-w-[160px] py-2"
            >
              Thêm gói mới
            </Button>
          </motion.div>
        </div>
      </Paper>

      {/* Tabs */}
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 mb-4">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md px-4 py-2 transition-all duration-200"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md px-4 py-2 transition-all duration-200"
          >
            Đang hoạt động
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md px-4 py-2 transition-all duration-200"
          >
            Đã tạm dừng
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Package Cards Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Show skeletons while loading
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : packages && packages.length > 0 ? (
            // Show packages
            packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
          ) : (
            // Show empty state
            <motion.div
              className="col-span-3 text-center py-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-5xl mb-4">
                  <Icon
                    icon="lucide:package"
                    className="mx-auto h-16 w-16 text-gray-400"
                  />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  {searchTerm
                    ? `Không tìm thấy gói dịch vụ phù hợp với "${searchTerm}"`
                    : activeTab !== "all"
                    ? `Không có gói dịch vụ nào ${
                        activeTab === "active"
                          ? "đang hoạt động"
                          : "đã tạm dừng"
                      }`
                    : "Chưa có gói dịch vụ nào"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Hãy thử tìm kiếm với từ khóa khác"
                    : "Bắt đầu bằng việc tạo gói dịch vụ đầu tiên của bạn"}
                </p>
                <ShadcnButton
                  onClick={() => openDialog()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300"
                >
                  <Icon icon="lucide:plus" className="mr-2 h-4 w-4" />
                  Tạo gói dịch vụ
                </ShadcnButton>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-4 py-2 border border-gray-100">
            <ShadcnButton
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="hover:bg-blue-50 transition-colors"
            >
              <Icon icon="lucide:chevron-left" className="mr-1 h-4 w-4" />
              Trước
            </ShadcnButton>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <ShadcnButton
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[36px] h-9 p-0 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-blue-600 hover:bg-blue-50"
                  } transition-colors`}
                >
                  {i + 1}
                </ShadcnButton>
              ))}
            </div>

            <ShadcnButton
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="hover:bg-blue-50 transition-colors"
            >
              Tiếp
              <Icon icon="lucide:chevron-right" className="ml-1 h-4 w-4" />
            </ShadcnButton>
          </div>
        </motion.div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
        className="rounded-lg"
        PaperProps={{
          elevation: 24,
          className: "rounded-lg",
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4">
          {selectedPackage ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
        </DialogTitle>

        <DialogContent className="py-6 px-6">
          <div className="space-y-4 py-2">
            <TextField
              fullWidth
              label="Tên gói dịch vụ"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              required
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Giá"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                error={!!formErrors.price}
                helperText={formErrors.price}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: <span className="text-gray-500 mr-1">₫</span>,
                }}
              />

              <TextField
                fullWidth
                label="Thời hạn (ngày)"
                name="durationDays"
                type="number"
                value={formData.durationDays}
                onChange={handleInputChange}
                error={!!formErrors.durationDays}
                helperText={formErrors.durationDays}
                required
                margin="normal"
                variant="outlined"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Loại người dùng</InputLabel>
                <Select
                  label="Loại người dùng"
                  name="associatedRole"
                  value={formData.associatedRole}
                  onChange={handleInputChange}
                >
                  <MenuItem value="sportcoach">Huấn luyện viên</MenuItem>
                  <MenuItem value="sportcenter">Trung tâm thể thao</MenuItem>
                  <MenuItem value="player">Người chơi</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  label="Trạng thái"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Tạm dừng</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="bg-gray-50 border-t border-gray-100 px-6 py-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={closeDialog}
              variant="outlined"
              color="secondary"
              startIcon={<Icon icon="lucide:x" />}
              className="hover:bg-red-50 transition-colors"
            >
              Hủy
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={20} />
                ) : (
                  <Icon icon="lucide:check" />
                )
              }
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 ml-2"
            >
              {selectedPackage ? "Cập nhật" : "Tạo mới"}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Packages;
