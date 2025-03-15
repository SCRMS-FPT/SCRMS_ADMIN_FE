const API_CONFIG = {
  login: {
    baseUrl: "https://localhost:7158",
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
      list: (role = "") => `/api/admin/users${role ? "?role=" + role : ""}`,
      updateStatus: (userId) => `/api/admin/users/${userId}/status`,
      deleteUser: (userId) => `/api/admin/users/${userId}`,
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
      list: "/api/admin/users?role=coach",
      details: (coachId) => `/api/coaches/${coachId}`,
    },
  },
  servicePackageManagement: {
    baseUrl: "https://localhost:7105",
    endpoints: {
      list: "/api/admin/service-packages",
      details: (packageId) => `/api/admin/service-packages/${packageId}`,
      create: "/api/admin/service-packages",
      update: (packageId) => `/api/admin/service-packages/${packageId}`,
      delete: (packageId) => `/api/admin/service-packages/${packageId}`,
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
      reviewReports: "/api/admin/reviews/reports",
      deleteReview: (reviewId) => `/api/admin/reviews/${reviewId}`,
      listReports: "/api/admin/reports",
    },
  },
  systemSettings: {
    baseUrl: "?????",
    endpoints: {
      view: "/api/admin/settings",
      update: "/api/admin/settings",
    },
  },
};

export default API_CONFIG;
