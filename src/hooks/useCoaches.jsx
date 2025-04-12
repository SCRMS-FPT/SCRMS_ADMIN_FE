import { useState, useEffect } from "react";
import { getCoaches, getCoachDetails } from "../api/coachManagementAPI";

export const useCoaches = (
  name,
  minPrice,
  maxPrice,
  sportId,
  page = 1,
  pageSize = 10
) => {
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);

      try {
        const list = await getCoaches(
          name,
          minPrice,
          maxPrice,
          sportId,
          page - 1,
          pageSize
        );
        setCoaches(list);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchCoaches();
  }, [name, minPrice, maxPrice, sportId, page, pageSize]);

  const mutate = async () => {
    try {
      setIsLoading(true);
      const response = await getCoaches(
        name,
        minPrice,
        maxPrice,
        sportId,
        page - 1,
        pageSize
      );
      setCoaches(response);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  return { coaches, isLoading, error, mutate };
};
