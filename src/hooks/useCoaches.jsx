import { useState, useEffect } from "react";
import { getCoaches, getCoachDetails } from "../api/coachManagementAPI";

export const useCoaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true);

      try {
        const list = await getCoaches();
        setTimeout(() => {
          setCoaches(list);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  return { coaches, isLoading, error };
};
