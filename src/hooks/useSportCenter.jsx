import { deleteCourt } from "@/api/courtManagementAPI";
import {
  fetchSportCenters,
  getSportCenterCourts,
  getSportCenterDetails,
  deleteSportCenter,
} from "@/api/sportCenterManagementAPI";
import { fetchSports } from "@/api/sportManagementAPI";
import { useState, useEffect } from "react";

export const useSportCenter = (
  page = 1,
  limit = 10,
  city = null,
  name = null
) => {
  const [data, setData] = useState([]);
  const [maxPage, setMaxPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSportCenter = async () => {
      setIsLoading(true);
      try {
        const response = (await fetchSportCenters(page, limit, city, name))
          .sportCenters;

        setMaxPage(Math.ceil(response.count / limit));

        setTimeout(() => {
          setData(response.data);

          setIsLoading(false);
        }, 1000);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };
    fetchSportCenter();
  }, [page, limit, city, name]);

  return { data, maxPage, isLoading, error };
};

export const getDetails = (sportCenterId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [centerDetail, setCenterDetail] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDetailData = async () => {
      setIsLoading(true);
      try {
        const response = await getSportCenterDetails(sportCenterId);
        const { courts } = await getSportCenterCourts(sportCenterId);
        const { sports } = await fetchSports();
        const combinedData = { ...response, courts, sports };

        setTimeout(() => {
          setCenterDetail(combinedData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };
    fetchDetailData();
  }, [sportCenterId]);
  return { isLoading, centerDetail, error };
};

export const useDeleteSportCenter = async (sportCenterId) => {
  try {
    const response = await deleteSportCenter(sportCenterId);
    return response;
  } catch (error) {
    console.error("Error deleting sport center:", error);
    throw error;
  }
};

export const useDeleteCourt = async (courtId) => {
  try {
    const response = await deleteCourt(courtId);
    return response;
  } catch (error) {
    console.error("Error deleting court:", error);
    throw error;
  }
};
