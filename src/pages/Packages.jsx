import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePackages } from "../hooks/usePackages";
import { formatCurrency } from "@/lib/utils";
import { showToast, logoutUser } from "../lib/utils";

const ITEMS_PER_PAGE = 6;

const Packages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { packages, isLoading, error, totalPages } = usePackages(
    currentPage,
    ITEMS_PER_PAGE
  );

  if (error) {
    switch (error.status) {
      case 401: {
        logoutUser();
        return null;
      }
      default: {
        showToast(`error ${error.message}`, "error");
      }
    }
  }

  // Handle opening the dialog for creating or editing
  const openDialog = (pkg = null) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  // Handle closing the dialog
  const closeDialog = () => {
    setSelectedPackage(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    if (selectedPackage) {
      console.log("Updating package:", selectedPackage);
      showToast(`Updated ${selectedPackage.name} successfully`, "success");
    } else {
      console.log("Creating new package...");
      showToast("New package created successfully", "success");
    }
    closeDialog();
  };

  const filteredPackages = searchTerm
    ? packages.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : packages;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search packages..."
          className="w-full sm:w-[300px]"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Button onClick={() => openDialog()}>Add Package</Button>
      </div>

      {/* Package Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : packages && Array.isArray(packages) && packages.length > 0 ? (
          packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{formatCurrency(pkg.price)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{pkg.description}</p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <span>Duration: {pkg.duration} day</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog(pkg)}
                >
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nothing here</CardTitle>
              <CardDescription>There are no package available.</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Reusable Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPackage ? "Edit Package" : "Create New Package"}
            </DialogTitle>
            <DialogDescription>
              {selectedPackage
                ? "Update the details of this package."
                : "Add a new service package with details."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="package-name">Package Name</Label>
              <Input
                id="package-name"
                placeholder="Enter package name"
                defaultValue={selectedPackage?.name || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter package description"
                defaultValue={selectedPackage?.description || ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  defaultValue={selectedPackage?.price || ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 2 hours"
                  defaultValue={selectedPackage?.duration || ""}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPackage ? "Save Changes" : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Packages;
