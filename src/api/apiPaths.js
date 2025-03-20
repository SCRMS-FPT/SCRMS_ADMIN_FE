const API_CONFIG = {
  login: {
    baseUrl: "https://localhost:7105",
    endpoints: {
      login: "/api/identity/login",
    },
  },
  dashboard: {
    baseUrl: "https://localhost:7237",
    endpoints: {
      stats: "/api/admin/dashboard/stats",
      revenue: "/api/admin/reports/revenue",
      transactions: "/api/admin/reports/transactions",
    },
  },
  userManagement: {
    baseUrl: "https://localhost:7105",
    endpoints: {
      list: "/api/users",
      updateStatus: (userId) => `/api/users/${userId}/status`,
      deleteUser: (userId) => `/api/users/${userId}`,
      assignRoles: "/api/identity/admin/assign-roles",
    },
  },
  courtManagement: {
    baseUrl: "https://localhost:7158",
    endpoints: {
      list: "/api/admin/courts",
      details: (courtId) => `/api/courts/${courtId}`,
      update: (courtId) => `/api/admin/courts/${courtId}`,
      delete: (courtId) => `/api/admin/courts/${courtId}`,
    },
  },
  coachManagement: {
    baseUrl: "https://localhost:7237",
    endpoints: {
      list: "/coaches",
      details: (coachId) => `/api/coaches/${coachId}`,
    },
  },
  servicePackageManagement: {
    baseUrl: "https://localhost:7105",
    endpoints: {
      list: "/api/service-packages",
      details: (packageId) => `/api/service-packages/${packageId}`,
      create: "/api/service-packages",
      update: (packageId) => `/api/service-packages/${packageId}`,
      delete: (packageId) => `/api/service-packages/${packageId}`,
    },
  },
  paymentManagement: {
    baseUrl: "https://localhost:7107",
    endpoints: {
      transactions: "/api/admin/payments/transactions",
      refund: "/api/admin/payments/refund",
      transactionDetails: (transactionId) =>
        `/api/admin/payments/transactions/${transactionId}`,
    },
  },
  reviewReportManagement: {
    baseUrl: "https://localhost:7052",
    endpoints: {
      deleteReview: (reviewId) => `/api/admin/reviews/${reviewId}`,
      listReviews: "/api/review",
    },
  },
};

export default API_CONFIG;
