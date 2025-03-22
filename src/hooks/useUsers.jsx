import { useState, useEffect } from "react";
import { getUsers } from "../api/userManagementAPI";

export const useUsers = (
  pageSize = 5,
  page = 1,
  role = null,
  searchQuery = null
) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getUsers(searchQuery, role, page - 1, pageSize);
        const allUsers = data.data;
        setTotalPage(Math.ceil(data.count / pageSize));
        setTimeout(() => {
          // const allUsers = [
          //   {
          //     id: 1,
          //     name: "John Doe",
          //     email: "john@example.com",
          //     role: "User",
          //     status: "active",
          //   },
          //   {
          //     id: 2,
          //     name: "Jane Smith",
          //     email: "jane@example.com",
          //     role: "Court Owner",
          //     status: "active",
          //   },
          //   {
          //     id: 3,
          //     name: "Robert Johnson",
          //     email: "robert@example.com",
          //     role: "Coach",
          //     status: "inactive",
          //   },
          //   {
          //     id: 4,
          //     name: "Emily Davis",
          //     email: "emily@example.com",
          //     role: "User",
          //     status: "active",
          //   },
          //   {
          //     id: 5,
          //     name: "Michael Brown",
          //     email: "michael@example.com",
          //     role: "Court Owner",
          //     status: "active",
          //   },
          // ];

          setUsers(allUsers);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize, role, searchQuery]);

  return { users, isLoading, error, totalPages };
};
