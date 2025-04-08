import { useState, useEffect } from "react";
import { getReviews } from "../api/reviewReportAPI";
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);

      try {
        const listReviews = await getReviews();
        setTimeout(() => {
          setReviews(listReviews);
          // setReviews([
          //   {
          //     id: crypto.randomUUID(),
          //     reviewerId: crypto.randomUUID(),
          //     rating: 3,
          //     comment: "Testing",
          //     createdAt: new Date().toLocaleString(),
          //   },
          //   {
          //     id: crypto.randomUUID(),
          //     reviewerId: crypto.randomUUID(),
          //     rating: 6,
          //     comment: "Testing 2",
          //     createdAt: new Date().toLocaleString(),
          //   },
          //   {
          //     id: crypto.randomUUID(),
          //     reviewerId: crypto.randomUUID(),
          //     rating: 5,
          //     comment: "Testing 3",
          //     createdAt: new Date().toLocaleString(),
          //   },
          //   {
          //     id: crypto.randomUUID(),
          //     reviewerId: crypto.randomUUID(),
          //     rating: 1,
          //     comment: "Testing 4",
          //     createdAt: new Date().toLocaleString(),
          //   },
          // ]);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reviews, isLoading, error, totalPages };
};
