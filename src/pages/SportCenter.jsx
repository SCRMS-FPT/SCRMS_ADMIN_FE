import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { Search, Plus, MapPin, Phone, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSportCenter } from "@/hooks/useSportCenter";
import { showToast, logoutUser } from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listProvinces } from "@/api/vnPublicAPI";

export default function SportCentersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCity, setSearchCity] = useState("all");
  const [provinces, setProvinces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const { data, maxPage, isLoading, error } = useSportCenter(
    currentPage,
    itemsPerPage,
    searchTerm,
    searchCity === "all" ? "" : searchCity
  );

  if (error) {
    switch (error.status) {
      case 401: {
        logoutUser();
        return null;
      }
      default: {
        showToast(`Error: ${error.message}`, "error");
        console.log(error.message);
      }
    }
  }

  const updateSearchTerm = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, 500);

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await listProvinces();
      setProvinces(data);
    };

    fetchProvinces();

    return () => updateSearchTerm.cancel();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/sportcenters/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm trung tâm thể thao..."
            className="pl-8"
            onChange={(e) => updateSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setSearchCity} value={searchCity}>
          <SelectTrigger id="city-select" className="w-full sm:w-1/3">
            <SelectValue placeholder="Chọn thành phố" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {provinces.map((province) => (
              <SelectItem key={province.code} value={province.name}>
                {province.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Đang tải...</p>
      ) : data && Array.isArray(data) && data.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((center) => (
              <Card key={center.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={center.avatar} alt={center.name} />
                      <AvatarFallback>
                        {center.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span className="truncate" title={center.address}>
                          {center.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm mb-2">
                    <Phone className="mr-1 h-3 w-3" />
                    <span>{center.phoneNumber}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {center.description}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewDetails(center.id)}
                  >
                    Xem chi tiết
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Trước
              </Button>

              {[...Array(maxPage)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === maxPage}
              >
                Sau
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Không có trung tâm thể thao nào ở đây.
          </p>
        </div>
      )}
    </div>
  );
}
