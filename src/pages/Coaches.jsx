import { useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useCoaches } from "@/hooks/useCoaches";
import { logoutUser, showToast } from "../lib/utils";

const Coaches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { coaches, isLoading, error } = useCoaches();

  // Filter coaches by search term
  const filteredCoaches = searchTerm
    ? coaches.filter(
        (coach) =>
          coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coach.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : coaches;

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search coaches..."
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="badminton">Badminton</SelectItem>
              <SelectItem value="squash">Squash</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Add Coach</Button>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bio</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoaches &&
                Array.isArray(filteredCoaches) &&
                filteredCoaches.size > 0 ? (
                  filteredCoaches.map((coach) => (
                    <TableRow key={coach.userId}>
                      <TableCell>{coach.bio}</TableCell>
                      <TableCell>{coach.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                          <span>{coach.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>View Schedule</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Remove Coach
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center">
                      No users available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Coaches;
