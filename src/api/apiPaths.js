export const BASE_URL = "http://localhost:5002";

export const API_CONFIG = {
  login: {
    endpoints: {
      login: "/api/identity/login",
    },
  },
  dashboard: {
    endpoints: {
      coachStats: (startDate, endDate, groupBy) =>
        `/api/coach/dashboard/stats?${
          startDate ? `start_date=${startDate}` : ""
        }${endDate ? `&end_date=${endDate}` : ""}${
          groupBy ? `&group_by=${groupBy}` : ""
        }`,
      identityStats: `/api/admin/dashboard/stats`,
      courtStats: (startDate, endDate) =>
        `/api/admin/court-stats?${startDate ? `start_date=${startDate}` : ""}${
          endDate ? `&end_date=${endDate}` : ""
        }`,
    },
  },
  userManagement: {
    endpoints: {
      list: (searchQuery, role, page, pageSize) =>
        `/api/users?pageIndex=${page}&pageSize=${pageSize}${
          searchQuery ? `&searchTerm=${encodeURIComponent(searchQuery)}` : ""
        }${role ? `&role=${encodeURIComponent(role)}` : ""}`,
      getDetail: (userId) => `/api/users/${userId}/full`,
      updateProfile: (userId) => `/api/users/${userId}`,
      deleteUser: (userId) => `/api/users/${userId}`,
      assignRoles: "/api/identity/admin/assign-roles",
    },
  },
  courtManagement: {
    endpoints: {
      list: "/api/admin/courts",
      details: (courtId) => `/api/courts/${courtId}`,
      update: (courtId) => `/api/admin/courts/${courtId}`,
      delete: (courtId) => `/api/admin/courts/${courtId}`,
    },
  },
  coachManagement: {
    endpoints: {
      list: "/coaches",
      details: (coachId) => `/api/coaches/${coachId}`,
    },
  },
  servicePackageManagement: {
    endpoints: {
      list: "/api/service-packages",
      details: (packageId) => `/api/service-packages/${packageId}`,
      create: "/api/service-packages",
      update: (packageId) => `/api/service-packages/${packageId}`,
      delete: (packageId) => `/api/service-packages/${packageId}`,
    },
  },
  paymentManagement: {
    endpoints: {
      transactions: "/api/admin/payments/transactions",
      refund: "/api/admin/payments/refund",
      transactionDetails: (transactionId) =>
        `/api/admin/payments/transactions/${transactionId}`,
    },
  },
  reviewReportManagement: {
    endpoints: {
      deleteReview: (reviewId) => `/api/admin/reviews/${reviewId}`,
      listReviews: "/api/review",
    },
  },
};
