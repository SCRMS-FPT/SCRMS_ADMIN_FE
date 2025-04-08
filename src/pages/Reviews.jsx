import { useState } from "react";
import { ChevronDown, Star, StarOff, StarsIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusBadge from "@/components/ui/StatusBadge";
import { logoutUser, showToast } from "../lib/utils";
import { useReviews } from "../hooks/useReviews";

const Reviews = () => {
  const { reviews, isLoading, error, totalPages } = useReviews();
  const [page, setPage] = useState(1);

  if (error) {
    switch (error.status) {
      case 401: {
        logoutUser();
        return null;
      }
      default: {
        showToast(`Error: ${error.message}`, "error");
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="under review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reviewer Id</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews && Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">
                          {review.reviewerId}
                        </TableCell>

                        <TableCell className="flex items-center gap-1">
                          {review.rating}{" "}
                          <Star className="w-5 h-5 text-yellow-500" />
                        </TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>{review.createdAt}</TableCell>
                        {/* <TableCell>
                        <StatusBadge status={review.status} />
                      </TableCell> */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Review</DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Review
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="5" className="text-center">
                        Không có nhận xét nào...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-end mt-4">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Trước
                </Button>
                <span className="mx-4">
                  Trang {page} trên {totalPages}
                </span>
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Kế tiếp
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
