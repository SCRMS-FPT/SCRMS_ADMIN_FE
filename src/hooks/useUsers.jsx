import { useState, useEffect } from "react";
import { getUsers } from "../api/userManagementAPI";

export const useUsers = (role = "all") => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const allUsers = await getUsers();
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

          const filteredUsers =
            role === "all"
              ? allUsers
              : allUsers.filter(
                  (user) => user.role.toLowerCase() === role.toLowerCase()
                );

          setUsers(filteredUsers);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  return { users, isLoading, error, totalPages };
};
