import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
  Avatar,
  Chip,
  Divider,
  Box,
  Paper,
  Rating,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  FlagOutlined,
  DeleteOutlined,
  MessageOutlined,
  CloseOutlined,
  UserOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Popconfirm, Skeleton, Empty, Tag, message } from "antd";
import { Client as ReviewClient } from "../api/ReviewApi";
import { Client as CoachClient } from "../api/CoachApi";
import { Client as CourtClient } from "../api/CourtApi";
import { Client as IdentityClient } from "../api/IdentityApi";
import { formatDate, showToast } from "../lib/utils";

const REVIEW_CLIENT = new ReviewClient();
const COACH_CLIENT = new CoachClient();
const COURT_CLIENT = new CourtClient();
const IDENTITY_CLIENT = new IdentityClient();

const FlaggedReviews = () => {
  // State
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewDetails, setReviewDetails] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [authorDetails, setAuthorDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch flagged reviews
  const fetchFlaggedReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await REVIEW_CLIENT.getReviewFlags(
        statusFilter, // Add status parameter
        currentPage,
        reviewsPerPage
      );

      // Extract data from the new response structure
      setFlaggedReviews(response.data || []);
      setTotalPages(Math.ceil((response.count || 0) / reviewsPerPage));
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching flagged reviews:", err);
      setError(err.message || "Failed to load flagged reviews");
      setIsLoading(false);
      showToast("Error loading flagged reviews", "error");
    }
  };

  // Load flagged reviews on component mount and page change
  useEffect(() => {
    fetchFlaggedReviews();
  }, [currentPage, statusFilter]);

  // Open review details modal
  const handleViewReviewDetails = async (flaggedReview) => {
    console.log("Selected review for details:", flaggedReview);
    setSelectedReview(flaggedReview);
    setIsDetailModalOpen(true);
    await fetchReviewDetails(flaggedReview.review.id);
  };

  // Fetch review details and related information
  const fetchReviewDetails = async (reviewId) => {
    setIsLoadingDetails(true);
    setReviewDetails(null);
    setSubjectDetails(null);
    setAuthorDetails(null);

    try {
      // Get detailed review information
      const reviewData = await REVIEW_CLIENT.getReviewDetail(reviewId);
      setReviewDetails(reviewData);

      // Get author information
      if (reviewData.reviewerId) {
        try {
          const authorData = await IDENTITY_CLIENT.full(reviewData.reviewerId);
          setAuthorDetails(authorData);
        } catch (err) {
          console.error("Error fetching author details:", err);
        }
      }

      // Get subject information (coach or court)
      if (reviewData.subjectType && reviewData.subjectId) {
        try {
          if (reviewData.subjectType.toLowerCase() === "coach") {
            const coachData = await COACH_CLIENT.getCoachById(
              reviewData.subjectId
            );
            setSubjectDetails({ type: "coach", data: coachData });
          } else if (reviewData.subjectType.toLowerCase() === "court") {
            const courtData = await COURT_CLIENT.getCourtDetails(
              reviewData.subjectId
            );
            setSubjectDetails({ type: "court", data: courtData });
          }
        } catch (err) {
          console.error("Error fetching subject details:", err);
        }
      }
    } catch (err) {
      console.error("Error fetching review details:", err);
      showToast("Error loading review details", "error");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    setIsDeleting(true);
    try {
      await REVIEW_CLIENT.deleteReview(selectedReview.review.id);
      showToast("Review deleted successfully", "success");
      setIsDetailModalOpen(false);

      // Refresh the list
      fetchFlaggedReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
      showToast("Error deleting review", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Dismiss report
  const handleDismissReport = async () => {
    if (!selectedReview) return;

    setIsDeleting(true);
    try {
      await REVIEW_CLIENT.updateReviewFlagStatus(selectedReview.id, {
        status: "Rejected",
        adminNote: "Review report dismissed by administrator",
      });

      showToast("Report dismissed successfully", "success");
      setIsDetailModalOpen(false);

      // Refresh the list
      fetchFlaggedReviews();
    } catch (err) {
      console.error("Error dismissing report:", err);
      showToast("Error dismissing report", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Add new function to accept the report and delete the review
  const handleAcceptReport = async () => {
    if (!selectedReview) return;

    setIsDeleting(true);
    try {
      // First mark the flag as accepted
      await REVIEW_CLIENT.updateReviewFlagStatus(selectedReview.id, {
        status: "Accepted",
        adminNote: "Report accepted and review removed by administrator",
      });

      // Then delete the review
      await REVIEW_CLIENT.deleteReview(selectedReview.review.id);

      showToast("Report accepted and review deleted successfully", "success");
      setIsDetailModalOpen(false);

      // Refresh the list
      fetchFlaggedReviews();
    } catch (err) {
      console.error("Error accepting report:", err);
      showToast("Error accepting report", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Render flagged review card
  const FlaggedReviewCard = ({ review }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{
          scale: 1.02,
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Card className="border border-gray-100 hover:border-red-200 transition-all duration-200">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <FlagOutlined className="text-red-500 mr-2 text-xl" />
                <div>
                  <Typography variant="subtitle1" className="font-medium">
                    Reported Review
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    ID: {review.reviewId.substring(0, 8)}...
                  </Typography>
                </div>
              </div>
              <Tag color="red">1 report</Tag>
            </div>

            <Divider className="my-2" />

            <div className="my-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Rating
                    value={review.review.rating || 0}
                    readOnly
                    size="small"
                  />
                  <Typography variant="body2" className="ml-2 text-gray-600">
                    {review.review.rating}/5
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-500">
                  <CalendarOutlined className="mr-1" />
                  {formatDate(review.review.createdAt)}
                </Typography>
              </div>

              <Typography
                variant="body2"
                className="line-clamp-2 text-gray-700"
              >
                {review.review.comment || "No comment provided"}
              </Typography>
            </div>

            <Divider className="my-2" />

            <div className="mt-3 flex justify-between items-center">
              <div>
                <Typography
                  variant="caption"
                  className="text-gray-500 flex items-center"
                >
                  <ExclamationCircleOutlined className="mr-1" />
                  Reason: {review.flagReason || "Not specified"}
                </Typography>
              </div>

              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleViewReviewDetails(review)}
                startIcon={<InfoCircleOutlined />}
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  // Loading skeleton
  const SkeletonCard = () => (
    <Card className="border border-gray-100">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <Skeleton.Avatar active size="small" className="mr-2" />
            <div>
              <Skeleton.Input style={{ width: 150 }} active size="small" />
              <Skeleton.Input style={{ width: 100 }} active size="small" />
            </div>
          </div>
          <Skeleton.Button active size="small" />
        </div>

        <Divider className="my-2" />

        <div className="my-3">
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>

        <Divider className="my-2" />

        <div className="mt-3 flex justify-between items-center">
          <Skeleton.Input style={{ width: 150 }} active size="small" />
          <Skeleton.Button active size="small" />
        </div>
      </div>
    </Card>
  );

  // Get subject type description
  const getSubjectTypeDescription = (type) => {
    switch (type?.toLowerCase()) {
      case "coach":
        return "Coach Review";
      case "court":
        return "Court Review";
      case "sportcenter":
        return "Sport Center Review";
      default:
        return "Review";
    }
  };

  // Add this new function to handle opening the confirmation dialog
  const openConfirmDialog = () => {
    setIsConfirmDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="mb-6">
        <Typography
          variant="h4"
          component="h1"
          className="text-gray-800 font-bold"
        >
          Flagged Reviews
        </Typography>
        <Typography variant="body1" className="text-gray-600 mt-1">
          Manage reports and moderate inappropriate content
        </Typography>
      </div>

      {/* Main Content */}
      <Paper className="p-4 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <FlagOutlined className="text-red-500 mr-2" />
            <Typography variant="h6">Reported Reviews</Typography>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Add Status Filter */}
            <FormControl size="small" className="min-w-[150px]">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="Accepted">Accepted</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<CheckOutlined />}
              onClick={fetchFlaggedReviews}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Alert severity="error" className="my-4">
            {error}
          </Alert>
        ) : flaggedReviews.length === 0 ? (
          <Empty
            description="No flagged reviews found"
            className="my-12"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Grid container spacing={3}>
            {flaggedReviews.map((flag) => (
              <Grid item xs={12} md={6} lg={4} key={flag.id}>
                <FlaggedReviewCard review={flag} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        {!isLoading && flaggedReviews.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Box className="flex items-center gap-1">
              <Button
                variant="outlined"
                size="small"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setCurrentPage(index + 1)}
                  className="min-w-[36px]"
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outlined"
                size="small"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Next
              </Button>
            </Box>
          </div>
        )}
      </Paper>

      {/* Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={() => !isDeleting && setIsDetailModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 24,
          className: "rounded-lg",
        }}
      >
        <DialogTitle className="bg-gray-50 border-b flex justify-between items-center">
          <Typography variant="h6">
            {getSubjectTypeDescription(reviewDetails?.subjectType)} Details
          </Typography>
          <IconButton
            onClick={() => setIsDetailModalOpen(false)}
            disabled={isDeleting}
            size="small"
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>

        <DialogContent className="p-0">
          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center p-8">
              <CircularProgress />
              <Typography className="mt-4">
                Loading review details...
              </Typography>
            </div>
          ) : (
            <>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                className="border-b"
              >
                <Tab
                  label={
                    <div className="flex items-center">
                      <FlagOutlined className="mr-1" />
                      Report Details
                    </div>
                  }
                />
                <Tab
                  label={
                    <div className="flex items-center">
                      <InfoCircleOutlined className="mr-1" />
                      {reviewDetails?.subjectType === "coach"
                        ? "Coach Info"
                        : "Court Info"}
                    </div>
                  }
                />
              </Tabs>

              {activeTab === 0 && (
                <Box className="p-6">
                  {/* Report Details Panel */}
                  <Grid container spacing={4}>
                    {/* Review Information */}
                    <Grid item xs={12} md={7}>
                      <Paper elevation={0} className="p-4 border rounded-lg">
                        <Typography
                          variant="h6"
                          className="mb-3 flex items-center"
                        >
                          <MessageOutlined className="mr-2" /> Review Content
                        </Typography>

                        <Box className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <Rating
                              value={reviewDetails?.rating || 0}
                              readOnly
                            />
                            <Typography
                              variant="body2"
                              className="text-gray-500"
                            >
                              {formatDate(reviewDetails?.createdAt)}
                            </Typography>
                          </div>

                          <Typography variant="body1" className="mb-2">
                            {reviewDetails?.comment || "No comment provided"}
                          </Typography>
                        </Box>

                        <Divider className="my-4" />

                        <Typography
                          variant="subtitle2"
                          className="mb-2 text-red-500 font-medium flex items-center"
                        >
                          <FlagOutlined className="mr-2" />
                          Report Information
                        </Typography>

                        <Box className="space-y-2">
                          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <div className="flex justify-between">
                              <Typography
                                variant="body2"
                                className="font-medium"
                              >
                                Reason:{" "}
                                {selectedReview?.flagReason || "Not specified"}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-gray-500"
                              >
                                {formatDate(selectedReview?.createdAt)}
                              </Typography>
                            </div>
                            <Typography
                              variant="body2"
                              className="mt-2 text-gray-600"
                            >
                              Status:{" "}
                              <Tag
                                color={
                                  selectedReview?.status === "pending"
                                    ? "orange"
                                    : selectedReview?.status === "accepted"
                                    ? "green"
                                    : "red"
                                }
                              >
                                {selectedReview?.status || "Pending"}
                              </Tag>
                            </Typography>
                          </div>
                        </Box>
                      </Paper>
                    </Grid>

                    {/* Author Information - rest of the code */}
                    <Grid item xs={12} md={5}>
                      <Paper
                        elevation={0}
                        className="p-4 border rounded-lg h-full"
                      >
                        <Typography
                          variant="h6"
                          className="mb-3 flex items-center"
                        >
                          <UserOutlined className="mr-2" /> Author Information
                        </Typography>

                        {authorDetails ? (
                          <>
                            <Box className="flex items-center mb-4">
                              <Avatar
                                src={authorDetails.avatarUrl}
                                className="mr-3"
                                sx={{ width: 56, height: 56 }}
                              >
                                {authorDetails.firstName?.charAt(0)}
                                {authorDetails.lastName?.charAt(0)}
                              </Avatar>
                              <div>
                                <Typography variant="h6">
                                  {authorDetails.firstName}{" "}
                                  {authorDetails.lastName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-gray-500"
                                >
                                  {authorDetails.email}
                                </Typography>
                              </div>
                            </Box>

                            <Divider className="my-3" />

                            <Box className="mt-3 space-y-2">
                              <div className="flex justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-500"
                                >
                                  User ID:
                                </Typography>
                                <Typography variant="body2">
                                  {authorDetails.id.substring(0, 8)}...
                                </Typography>
                              </div>

                              <div className="flex justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-500"
                                >
                                  Status:
                                </Typography>
                                <Chip
                                  size="small"
                                  label={
                                    !authorDetails.IsDeleted
                                      ? "Active"
                                      : "Inactive"
                                  }
                                  color={
                                    !authorDetails.IsDeleted
                                      ? "success"
                                      : "default"
                                  }
                                />
                              </div>

                              <div className="flex justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-500"
                                >
                                  Roles:
                                </Typography>
                                <div>
                                  {authorDetails.roles?.map((role, index) => (
                                    <Chip
                                      key={index}
                                      size="small"
                                      label={role}
                                      color="primary"
                                      variant="outlined"
                                      className="ml-1"
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between">
                                <Typography
                                  variant="body2"
                                  className="text-gray-500"
                                >
                                  Joined:
                                </Typography>
                                <Typography variant="body2">
                                  {formatDate(authorDetails.createdAt)}
                                </Typography>
                              </div>
                            </Box>
                          </>
                        ) : (
                          <Alert severity="warning">
                            Author details not available or user may have been
                            deleted
                          </Alert>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {activeTab === 1 && (
                <Box className="p-6">
                  {/* Subject Details Panel */}
                  {subjectDetails ? (
                    subjectDetails.type === "coach" ? (
                      <CoachDetailsPanel coachData={subjectDetails.data} />
                    ) : (
                      <CourtDetailsPanel
                        courtData={subjectDetails.data.court}
                      />
                    )
                  ) : (
                    <Alert severity="warning" className="mt-4">
                      {reviewDetails?.subjectType === "coach"
                        ? "Coach"
                        : "Court"}{" "}
                      details not available
                    </Alert>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions className="bg-gray-50 border-t p-3">
          <Button
            onClick={() => setIsDetailModalOpen(false)}
            variant="outlined"
            disabled={isDeleting}
          >
            Close
          </Button>

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={handleDismissReport}
              variant="outlined"
              color="success"
              disabled={isDeleting}
              startIcon={<CheckOutlined />}
            >
              Dismiss Report
            </Button>

            <Button
              variant="contained"
              color="error"
              disabled={isDeleting}
              onClick={openConfirmDialog}
              startIcon={
                isDeleting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <DeleteOutlined />
                )
              }
            >
              {isDeleting ? "Processing..." : "Accept & Delete Review"}
            </Button>
          </div>
        </DialogActions>

        {/* Add a separate confirmation dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          PaperProps={{
            elevation: 24,
            className: "rounded-lg",
          }}
        >
          <DialogTitle className="bg-gray-50 border-b">
            Accept report and delete review?
          </DialogTitle>
          <DialogContent className="pt-4">
            <Typography>
              This action will mark the report as accepted and permanently
              delete the review.
            </Typography>
          </DialogContent>
          <DialogActions className="bg-gray-50 border-t p-3">
            <Button
              onClick={() => setIsConfirmDialogOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsConfirmDialogOpen(false);
                handleAcceptReport();
              }}
              variant="contained"
              color="error"
              startIcon={
                isDeleting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
              disabled={isDeleting}
            >
              Yes, Delete Review
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
    </motion.div>
  );
};

// Coach Details Panel Component
const CoachDetailsPanel = ({ coachData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Paper elevation={0} className="p-4 border rounded-lg h-full">
          <div className="flex items-center mb-4">
            <Avatar
              src={coachData.avatar}
              className="mr-3"
              sx={{ width: 64, height: 64 }}
            >
              {coachData.fullName?.charAt(0)}
            </Avatar>
            <div>
              <Typography variant="h6">{coachData.fullName}</Typography>
              <Typography variant="body2" className="text-gray-500">
                Coach
              </Typography>
            </div>
          </div>

          <Divider className="my-3" />

          <Typography variant="body2" className="text-gray-700 mb-3">
            <span className="font-medium">Email:</span> {coachData.email}
          </Typography>

          <Typography variant="body2" className="text-gray-700 mb-3">
            <span className="font-medium">Phone:</span>{" "}
            {coachData.phone || "N/A"}
          </Typography>

          <Typography variant="body2" className="text-gray-700 mb-3">
            <span className="font-medium">Rate:</span>{" "}
            {coachData.ratePerHour
              ? `${coachData.ratePerHour.toLocaleString()} VND/hour`
              : "N/A"}
          </Typography>

          <Typography variant="body2" className="text-gray-700">
            <span className="font-medium">Member since:</span>{" "}
            {formatDate(coachData.createdAt)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={0} className="p-4 border rounded-lg h-full">
          <Typography variant="h6" className="mb-3 flex items-center">
            <InfoCircleOutlined className="mr-2" /> Coach Information
          </Typography>

          {coachData.bio ? (
            <Typography
              variant="body2"
              className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg"
            >
              {coachData.bio}
            </Typography>
          ) : (
            <Alert severity="info" className="mb-4">
              No biography provided
            </Alert>
          )}

          <Divider className="my-3" />

          <Typography variant="subtitle2" className="mb-2 flex items-center">
            <TrophyOutlined className="mr-2" /> Sports
          </Typography>

          <div className="flex flex-wrap gap-2 mb-4">
            {coachData.sportIds?.length > 0 ? (
              coachData.sportIds.map((sport, index) => (
                <Chip
                  key={index}
                  label={sport}
                  size="small"
                  className="bg-blue-50 text-blue-700"
                />
              ))
            ) : (
              <Typography variant="body2" className="text-gray-500">
                No sports specified
              </Typography>
            )}
          </div>

          {coachData.packages?.length > 0 && (
            <>
              <Typography
                variant="subtitle2"
                className="mb-2 flex items-center"
              >
                <TeamOutlined className="mr-2" /> Available Packages
              </Typography>

              <div className="space-y-2">
                {coachData.packages.map((pkg, index) => (
                  <Paper
                    key={index}
                    className="p-2 bg-gray-50 rounded flex justify-between items-center"
                  >
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {pkg.name}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        {pkg.description}
                      </Typography>
                    </div>
                    <Chip
                      label={`${pkg.price.toLocaleString()} VND`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </div>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

// Court Details Panel Component
const CourtDetailsPanel = ({ courtData }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Paper elevation={0} className="p-4 border rounded-lg h-full">
          <Typography variant="h6" className="mb-3 flex items-center">
            <EnvironmentOutlined className="mr-2" /> Court Information
          </Typography>

          <div className="mb-4 bg-gray-50 p-3 rounded-lg">
            <Typography variant="subtitle1" className="font-medium">
              {courtData.courtName}
            </Typography>
            <Typography variant="body2" className="text-gray-700 mt-1">
              Sport Center: {courtData.sportCenterName || "N/A"}
            </Typography>
            <Typography variant="body2" className="text-gray-700">
              Sport: {courtData.sportName || "N/A"}
            </Typography>
          </div>

          <Divider className="my-3" />

          <Typography variant="body2" className="mb-2 text-gray-700">
            <span className="font-medium">Status:</span>{" "}
            <Chip
              size="small"
              label={courtData.status === 0 ? "Active" : "Inactive"}
              color={courtData.status === 0 ? "success" : "default"}
            />
          </Typography>

          <Typography variant="body2" className="mb-2 text-gray-700">
            <span className="font-medium">Type:</span>{" "}
            {courtData.courtType === 1
              ? "Indoor"
              : courtData.courtType === 2
              ? "Outdoor"
              : "Mixed"}
          </Typography>

          <Typography variant="body2" className="mb-2 text-gray-700">
            <span className="font-medium">Slot Duration:</span>{" "}
            {courtData.slotDuration} minutes
          </Typography>

          <Typography variant="body2" className="mb-2 text-gray-700">
            <span className="font-medium">Min Deposit:</span>{" "}
            {courtData.minDepositPercentage}%
          </Typography>

          <Typography variant="body2" className="text-gray-700">
            <span className="font-medium">Created:</span>{" "}
            {formatDate(courtData.createdAt)}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={7}>
        <Paper elevation={0} className="p-4 border rounded-lg h-full">
          <Typography variant="h6" className="mb-3">
            Description
          </Typography>

          {courtData.description ? (
            <Typography
              variant="body2"
              className="text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg"
            >
              {courtData.description}
            </Typography>
          ) : (
            <Alert severity="info" className="mb-4">
              No description provided
            </Alert>
          )}

          <Divider className="my-3" />

          <Typography variant="subtitle2" className="mb-2">
            Facilities
          </Typography>

          {courtData.facilities?.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {courtData.facilities.map((facility, index) => (
                <Chip
                  key={index}
                  label={facility.name}
                  size="small"
                  className="bg-green-50 text-green-700"
                />
              ))}
            </div>
          ) : (
            <Typography variant="body2" className="text-gray-500 mb-4">
              No facilities specified
            </Typography>
          )}

          {courtData.promotions?.length > 0 && (
            <>
              <Divider className="my-3" />

              <Typography variant="subtitle2" className="mb-2">
                Active Promotions
              </Typography>

              <div className="space-y-2">
                {courtData.promotions.map((promo, index) => (
                  <Paper
                    key={index}
                    className="p-2 bg-gray-50 rounded flex justify-between items-center"
                  >
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {promo.description || "Discount"}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        Valid until: {formatDate(promo.validTo)}
                      </Typography>
                    </div>
                    <Chip
                      label={`${
                        promo.discountType === "Percentage"
                          ? promo.discountValue + "%"
                          : promo.discountValue.toLocaleString() + " VND"
                      }`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </Paper>
                ))}
              </div>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};
CourtDetailsPanel.propTypes = {
  courtData: PropTypes.shape({
    courtName: PropTypes.string,
    sportCenterName: PropTypes.string,
    sportName: PropTypes.string,
    status: PropTypes.number,
    courtType: PropTypes.number,
    slotDuration: PropTypes.number,
    minDepositPercentage: PropTypes.number,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    description: PropTypes.string,
    facilities: PropTypes.arrayOf(PropTypes.object),
    promotions: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

CoachDetailsPanel.propTypes = {
  coachData: PropTypes.object.isRequired,
};
export default FlaggedReviews;
