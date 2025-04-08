import { useState, useEffect } from "react";
import { getServicePackages } from "../api/servicePackageAPI";

export const usePackages = (page, recordPerPage) => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPage] = useState(1);

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);

      try {
        const listPackage = await getServicePackages();
        setTimeout(() => {
          // DEMO
          // setPackages([
          //   {
          //     id: crypto.randomUUID(),
          //     name: "Basic Package",
          //     description: "1 hour court booking",
          //     price: 50,
          //     duration: 5,
          //   },
          //   {
          //     id: crypto.randomUUID(),
          //     name: "Standard Package",
          //     description: "2 hour court booking with coach",
          //     price: 120,
          //     duration: 1,
          //   },
          //   {
          //     id: crypto.randomUUID(),
          //     name: "Premium Package",
          //     description: "4 hour court booking with coach and equipment",
          //     price: 200,
          //     duration: 3,
          //   },
          //   {
          //     id: crypto.randomUUID(),
          //     name: "Elite Package",
          //     description: "Full day court access with premium services",
          //     price: 500,
          //     duration: 5,
          //   },
          // ]);
          setPackages(listPackage);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [page, recordPerPage]);

  return { packages, isLoading, error, totalPages };
};
