import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Avatar,
  Box,
  Divider,
  Grid,
  Skeleton,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  UserOutlined,
  WalletOutlined,
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  MoneyCollectOutlined,
  MessageOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Tooltip, Badge, Popconfirm, Tag, message } from "antd";
import { Client as PaymentClient } from "../api/PaymentApits";
import { Client as IdentityClient } from "../api/IdentityApi";
import { formatCurrency, formatDate, showToast } from "../lib/utils";

const API_PAYMENT_CLIENT = new PaymentClient();
const API_IDENTITY_CLIENT = new IdentityClient();

// Status color mapping
const statusColors = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
  Completed: "success",
  Cancelled: "default",
};

const WithdrawalRequests = () => {
  // States
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processForm, setProcessForm] = useState({ status: "", adminNote: "" });
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [error, setError] = useState(null);

  // Fetch withdrawal requests
  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await API_PAYMENT_CLIENT.getPendingWithdrawalRequests(
        page,
        pageSize
      );
      setRequests(response.data || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(Math.ceil((response.totalCount || 0) / pageSize));
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching withdrawal requests:", err);
      setError(err.message || "Failed to fetch withdrawal requests");
      setIsLoading(false);
      showToast("Error fetching withdrawal requests", "error");
    }
  };

  // Fetch user details and balance
  const fetchUserDetails = async (userId) => {
    setIsLoadingDetails(true);
    setError(null);
    try {
      // Fetch user profile and wallet balance in parallel
      const [profileResponse, balanceResponse] = await Promise.all([
        API_IDENTITY_CLIENT.full(userId),
        API_PAYMENT_CLIENT.getUserWalletBalance(userId),
      ]);

      setUserDetails(profileResponse);
      setUserBalance(balanceResponse);
      setIsLoadingDetails(false);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError(err.message || "Failed to fetch user details");
      setIsLoadingDetails(false);
      showToast("Error fetching user details", "error");
    }
  };

  // Process withdrawal request (approve/reject)
  const processRequest = async () => {
    if (!processForm.status) {
      showToast("Please select a status", "error");
      return;
    }

    setIsProcessing(true);
    try {
      await API_PAYMENT_CLIENT.processWithdrawalRequest(selectedRequest.id, {
        status: processForm.status,
        adminNote: processForm.adminNote,
      });

      showToast(
        `Request ${
          processForm.status === "Approved" ? "approved" : "rejected"
        } successfully`,
        "success"
      );

      setIsProcessModalOpen(false);
      setIsModalOpen(false);
      fetchRequests(); // Refresh the list
    } catch (err) {
      console.error("Error processing withdrawal request:", err);
      showToast(
        `Error: ${err.message || "Failed to process request"}`,
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Open details modal
  const openDetailsModal = async (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    await fetchUserDetails(request.userId);
  };

  // Open process modal
  const openProcessModal = (status) => {
    setProcessForm({
      status,
      adminNote: "",
    });
    setIsProcessModalOpen(true);
  };

  // Initial fetch and refetch on page/filter change
  useEffect(() => {
    fetchRequests();
  }, [page, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    if (searchTerm || statusFilter) {
      setPage(1);
    }
  }, [searchTerm, statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Typography
            variant="h4"
            component="h1"
            className="text-gray-800 font-bold"
          >
            Withdrawal Requests
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-1">
            Manage withdrawal requests from users
          </Typography>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <TextField
            placeholder="Search by name or account..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlined />
                </InputAdornment>
              ),
            }}
            className="min-w-[200px]"
          />

          <FormControl size="small" className="min-w-[150px]">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<ReloadOutlined />}
            onClick={fetchRequests}
          >
            Refresh
          </Button>
        </div>
      </div>

      <Paper className="overflow-hidden rounded-xl shadow-md">
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="font-semibold">User</TableCell>
                <TableCell className="font-semibold">Amount</TableCell>
                <TableCell className="font-semibold">Bank Info</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Created Date</TableCell>
                <TableCell className="font-semibold text-center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Loading skeletons
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton variant="circular" width={40} height={40} />
                        <div>
                          <Skeleton variant="text" width={120} />
                          <Skeleton variant="text" width={80} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={150} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rounded" width={120} height={36} />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-red-500"
                  >
                    <div className="flex flex-col items-center">
                      <CloseCircleOutlined className="text-3xl mb-2" />
                      <Typography>Error: {error}</Typography>
                      <Button
                        variant="outlined"
                        onClick={fetchRequests}
                        className="mt-4"
                        startIcon={<ReloadOutlined />}
                      >
                        Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center">
                      <WalletOutlined className="text-5xl text-gray-300 mb-3" />
                      <Typography
                        variant="h6"
                        className="text-gray-500 font-medium"
                      >
                        No withdrawal requests found
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-400 mb-4"
                      >
                        {searchTerm || statusFilter
                          ? "Try adjusting your search or filter criteria"
                          : "All withdrawal requests will appear here when users make requests"}
                      </Typography>
                      {(searchTerm || statusFilter) && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSearchTerm("");
                            setStatusFilter("");
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-primary">
                          <UserOutlined />
                        </Avatar>
                        <div>
                          <Typography variant="body1" className="font-medium">
                            {request.accountHolderName}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            ID: {request.userId.substring(0, 8)}...
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        className="font-medium text-green-600"
                      >
                        {formatCurrency(request.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Typography variant="body2" className="font-medium">
                          {request.bankName}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                          Acc: {request.accountNumber}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={statusColors[request.status] || "default"}
                        size="small"
                        className="font-medium"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" className="text-gray-600">
                        {formatDate(request.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Tooltip title="View Details">
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openDetailsModal(request)}
                              startIcon={<EyeOutlined />}
                            >
                              Details
                            </Button>
                          </motion.div>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && requests.length > 0 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, totalCount)} of {totalCount} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                size="small"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                startIcon={<ArrowLeftOutlined />}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show 5 pages max, centered around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "contained" : "outlined"}
                      size="small"
                      className={`min-w-[36px] px-2`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outlined"
                size="small"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                endIcon={<ArrowRightOutlined />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Paper>

      {/* Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 24,
          className: "rounded-lg",
        }}
      >
        <DialogTitle className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <Typography variant="h6">Withdrawal Request Details</Typography>
            {selectedRequest && (
              <Chip
                label={selectedRequest.status}
                color={statusColors[selectedRequest.status] || "default"}
                className="font-medium"
              />
            )}
          </div>
        </DialogTitle>
        <DialogContent className="p-6">
          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CircularProgress size={40} className="mb-4" />
              <Typography>Loading details...</Typography>
            </div>
          ) : selectedRequest ? (
            <Grid container spacing={4}>
              {/* Request Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} className="p-4 border rounded-lg h-full">
                  <Typography
                    variant="h6"
                    className="mb-4 flex items-center gap-2"
                  >
                    <MoneyCollectOutlined /> Request Information
                  </Typography>

                  <div className="space-y-4">
                    <div>
                      <Typography variant="body2" className="text-gray-500">
                        Amount
                      </Typography>
                      <Typography
                        variant="h5"
                        className="text-green-600 font-bold"
                      >
                        {formatCurrency(selectedRequest.amount)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="body2" className="text-gray-500">
                        Bank Information
                      </Typography>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BankOutlined className="text-blue-500" />
                          <Typography variant="body1" className="font-medium">
                            {selectedRequest.bankName}
                          </Typography>
                        </div>
                        <div className="ml-6 space-y-1">
                          <Typography variant="body2">
                            <span className="text-gray-500">
                              Account Number:
                            </span>{" "}
                            {selectedRequest.accountNumber}
                          </Typography>
                          <Typography variant="body2">
                            <span className="text-gray-500">
                              Account Holder:
                            </span>{" "}
                            {selectedRequest.accountHolderName}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Typography variant="body2" className="text-gray-500">
                        Date Requested
                      </Typography>
                      <div className="flex items-center gap-2 mt-1">
                        <CalendarOutlined className="text-gray-400" />
                        <Typography>
                          {formatDate(selectedRequest.createdAt, true)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="body2" className="text-gray-500">
                        Request ID
                      </Typography>
                      <Typography
                        variant="body2"
                        className="font-mono bg-gray-100 p-1 rounded mt-1"
                      >
                        {selectedRequest.id}
                      </Typography>
                    </div>
                  </div>
                </Paper>
              </Grid>

              {/* User Information */}
              <Grid item xs={12} md={6}>
                <Paper elevation={0} className="p-4 border rounded-lg h-full">
                  <Typography
                    variant="h6"
                    className="mb-4 flex items-center gap-2"
                  >
                    <UserOutlined /> User Information
                  </Typography>

                  {userDetails ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={userDetails.avatarUrl}
                          className="w-16 h-16"
                        >
                          {userDetails.firstName?.charAt(0)}
                          {userDetails.lastName?.charAt(0)}
                        </Avatar>
                        <div>
                          <Typography variant="h6">
                            {userDetails.firstName} {userDetails.lastName}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            {userDetails.email}
                          </Typography>
                        </div>
                      </div>

                      <Divider />

                      <div>
                        <Typography variant="body2" className="text-gray-500">
                          Current Wallet Balance
                        </Typography>
                        <div className="flex items-center gap-2 mt-1">
                          <WalletOutlined className="text-blue-500" />
                          <Typography
                            variant="h6"
                            className="text-blue-600 font-bold"
                          >
                            {userBalance
                              ? formatCurrency(userBalance.balance)
                              : "N/A"}
                          </Typography>
                        </div>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-gray-500">
                          Membership Status
                        </Typography>
                        <div className="flex items-center gap-2 mt-1">
                          <Tag color={!userDetails.IsDeleted ? "green" : "red"}>
                            {!userDetails.IsDeleted ? "Active" : "Inactive"}
                          </Tag>
                          <Typography variant="body2">
                            {userDetails.roles?.join(", ")}
                          </Typography>
                        </div>
                      </div>

                      <div>
                        <Typography variant="body2" className="text-gray-500">
                          User ID
                        </Typography>
                        <Typography
                          variant="body2"
                          className="font-mono bg-gray-100 p-1 rounded mt-1"
                        >
                          {userDetails.id}
                        </Typography>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Typography className="text-gray-500">
                        User details unavailable
                      </Typography>
                    </div>
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <div className="text-center py-4">
              <Typography className="text-gray-500">
                Request details unavailable
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions className="bg-gray-50 border-t px-4 py-3">
          <div className="flex gap-2 w-full justify-between">
            <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>

            {selectedRequest && selectedRequest.status === "Pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseCircleOutlined />}
                  onClick={() => openProcessModal("Rejected")}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleOutlined />}
                  onClick={() => openProcessModal("Approved")}
                >
                  Approve
                </Button>
              </div>
            )}
          </div>
        </DialogActions>
      </Dialog>

      {/* Process Request Modal */}
      <Dialog
        open={isProcessModalOpen}
        onClose={() => !isProcessing && setIsProcessModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 24,
          className: "rounded-lg",
        }}
      >
        <DialogTitle className="bg-gray-50 border-b">
          <Typography variant="h6">
            {processForm.status === "Approved" ? "Approve" : "Reject"}{" "}
            Withdrawal Request
          </Typography>
        </DialogTitle>
        <DialogContent className="p-6">
          <div className="py-2">
            <Typography variant="body2" className="mb-4">
              {processForm.status === "Approved"
                ? "Please confirm that you want to approve this withdrawal request. Add any notes about the transaction."
                : "Please provide a reason for rejection so the user understands why their request was rejected."}
            </Typography>

            <TextField
              label="Admin Note"
              multiline
              rows={4}
              value={processForm.adminNote}
              onChange={(e) =>
                setProcessForm({ ...processForm, adminNote: e.target.value })
              }
              fullWidth
              required
              placeholder={
                processForm.status === "Approved"
                  ? "E.g., Approved and processed via bank transfer on April 9, 2023"
                  : "E.g., Insufficient information provided, please provide correct account details."
              }
              variant="outlined"
              className="mt-2"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MessageOutlined />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </DialogContent>
        <DialogActions className="bg-gray-50 border-t px-4 py-3">
          <Button
            variant="outlined"
            onClick={() => !isProcessing && setIsProcessModalOpen(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={processForm.status === "Approved" ? "success" : "error"}
            onClick={processRequest}
            disabled={isProcessing || !processForm.adminNote.trim()}
            startIcon={
              isProcessing ? (
                <CircularProgress size={20} color="inherit" />
              ) : processForm.status === "Approved" ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
          >
            {isProcessing
              ? "Processing..."
              : processForm.status === "Approved"
              ? "Confirm Approval"
              : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default WithdrawalRequests;
