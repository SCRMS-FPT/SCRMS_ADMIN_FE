import { useState, useEffect } from "react";
import { Card, Skeleton, Switch, Popconfirm, message } from "antd";
import { motion } from "framer-motion";
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
} from "@mui/material";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  CloseOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
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
      const response = await API_CLIENT.servicePackages(
        currentPage - 1, // API is 0-indexed
        ITEMS_PER_PAGE,
        searchTerm,
        "", // associatedRole
        "", // status
        "" // sortByPrice
      );

      // Assuming response has the format { data: [...packages], totalCount: number, totalPages: number }
      setPackages(response.data || []);
      setTotalPages(response.totalPages || 1);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError(err);
      setIsLoading(false);

      if (err.status === 401) {
        logoutUser();
      } else {
        showToast(
          `Error: ${err.message || "Failed to load packages"}`,
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
        showToast(`Error: ${error.message}`, "error");
      }
    }
  }, [error]);

  // Load packages on initial render and when dependencies change
  useEffect(() => {
    fetchPackages();
  }, [currentPage, searchTerm]);

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
      errors.name = "Package name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (formData.durationDays <= 0) {
      errors.durationDays = "Duration must be greater than 0";
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
        showToast(`Package "${formData.name}" updated successfully`, "success");
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
        showToast(`Package "${formData.name}" created successfully`, "success");
      }

      closeDialog();
      fetchPackages(); // Refresh the list
    } catch (err) {
      console.error("Error saving package:", err);
      showToast(`Error: ${err.message || "Failed to save package"}`, "error");
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
      showToast("Package deleted successfully", "success");
      fetchPackages(); // Refresh the list
    } catch (err) {
      console.error("Error deleting package:", err);
      showToast(`Error: ${err.message || "Failed to delete package"}`, "error");
    } finally {
      setIsDeleting(false);
      setDeleteItemId(null);
    }
  };

  // Package card component with animations
  const PackageCard = ({ pkg }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      className="relative"
    >
      <Card
        className="h-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:border-blue-300 transition-all duration-200"
        cover={
          <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <h3 className="text-white text-xl font-semibold">
              {formatCurrency(pkg.price)}
            </h3>
          </div>
        }
        actions={[
          <Tooltip title="Edit package">
            <IconButton
              onClick={() => openDialog(pkg)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <EditOutlined />
            </IconButton>
          </Tooltip>,
          <Popconfirm
            title="Delete this package?"
            description="This action cannot be undone"
            onConfirm={() => handleDelete(pkg.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete package">
              <IconButton
                className="text-red-500 hover:text-red-700 transition-colors"
                disabled={isDeleting && deleteItemId === pkg.id}
              >
                {isDeleting && deleteItemId === pkg.id ? (
                  <CircularProgress size={20} />
                ) : (
                  <DeleteOutlined />
                )}
              </IconButton>
            </Tooltip>
          </Popconfirm>,
        ]}
      >
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {pkg.name}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {pkg.description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <Chip
              label={pkg.status === "active" ? "Active" : "Inactive"}
              color={pkg.status === "active" ? "success" : "default"}
              size="small"
            />
            <span className="text-sm text-gray-500">
              {pkg.durationDays} {pkg.durationDays === 1 ? "day" : "days"}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Skeleton loader for cards
  const SkeletonCard = () => (
    <Card className="h-full shadow-md rounded-lg overflow-hidden border border-gray-100">
      <div className="h-24 bg-gray-200 animate-pulse"></div>
      <div className="p-4 space-y-3">
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
      {/* Header with search and add button */}
      <Paper className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <TextField
              fullWidth
              placeholder="Search packages..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <SearchOutlined className="mr-2 text-gray-400" />
                ),
                endAdornment: searchTerm && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    className="text-gray-400"
                  >
                    <CloseOutlined style={{ fontSize: "14px" }} />
                  </IconButton>
                ),
              }}
              className="bg-gray-50 hover:bg-white transition-colors duration-200"
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PlusOutlined />}
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 min-w-[160px] py-2"
          >
            Add Package
          </Button>
        </div>
      </Paper>

      {/* Package Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Show skeletons while loading
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : packages && packages.length > 0 ? (
          // Show packages
          packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
        ) : (
          // Show empty state
          <div className="col-span-3 text-center py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No packages found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? `No packages match "${searchTerm}"`
                    : "Get started by creating your first package"}
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlusOutlined />}
                  onClick={() => openDialog()}
                >
                  Create Package
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm px-4 py-2">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              startIcon={<ArrowLeftOutlined />}
              className="hover:bg-blue-50 transition-colors"
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "contained" : "outlined"}
                  color="primary"
                  size="small"
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-[36px] h-9 p-0 ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-blue-600 hover:bg-blue-50"
                  } transition-colors`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outlined"
              color="primary"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              endIcon={<ArrowRightOutlined />}
              className="hover:bg-blue-50 transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
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
        <DialogTitle className="bg-gray-50 border-b border-gray-100">
          {selectedPackage ? "Edit Package" : "Create New Package"}
        </DialogTitle>

        <DialogContent className="py-4">
          <div className="space-y-4 py-2">
            <TextField
              fullWidth
              label="Package Name"
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
              label="Description"
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
                label="Price"
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
                  startAdornment: <span className="text-gray-500 mr-1">$</span>,
                }}
              />

              <TextField
                fullWidth
                label="Duration (days)"
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
                <InputLabel>Associated Role</InputLabel>
                <Select
                  label="Associated Role"
                  name="associatedRole"
                  value={formData.associatedRole}
                  onChange={handleInputChange}
                >
                  <MenuItem value="sportcoach">Sport Coach</MenuItem>
                  <MenuItem value="sportcenter">Sport Center</MenuItem>
                  <MenuItem value="player">Player</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="bg-gray-50 border-t border-gray-100 px-4 py-3">
          <Button
            onClick={closeDialog}
            variant="outlined"
            color="secondary"
            startIcon={<CloseOutlined />}
            className="hover:bg-red-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={20} /> : <CheckOutlined />
            }
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            {selectedPackage ? "Update Package" : "Create Package"}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default Packages;
