export const BASE_URL = "http://localhost:5002";

export const API_CONFIG = {
  login: {
    endpoints: {
      login: "/api/identity/login",
    },
  },
  dashboard: {
    endpoints: {
      stats: "/api/admin/dashboard/stats",
      revenue: "/api/admin/reports/revenue",
      transactions: "/api/admin/reports/transactions",
    },
  },
  userManagement: {
    endpoints: {
      list: (searchQuery, role, page, pageSize) =>
        `/api/users?pageIndex=${page}&pageSize=${pageSize}${
          searchQuery ? `&searchTerm=${encodeURIComponent(searchQuery)}` : ""
        }${role ? `&role=${encodeURIComponent(role)}` : ""}`,
      getDetail: (userId) => `/api/users/${userId}/full`,
      updateStatus: (userId) => `/api/users/${userId}/status`,
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
