"use client";

import MenusEmpty from "@/components/manager-dashboard/menus/MenusEmpty";
import CreateMenuModal from "@/components/manager-dashboard/menus/CreateMenuModal";
import EditMenuModal from "@/components/manager-dashboard/menus/EditMenuModal";
import ViewMenuModal from "@/components/manager-dashboard/menus/ViewMenuModal";
import TableLoader from "@/components/TableLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/swr/useFetch";
import { useDelete } from "@/hooks/swr/useDelete";
import { IMenuItem, IPagination } from "@/types";
import { formatDate } from "@/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  X,
  XCircle,
  Trash2,
  Utensils,
  DollarSign,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import Swal from "sweetalert2";

interface ApiResponse {
  data: IMenuItem[];
  meta: IPagination;
}

export default function AdminMenusPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterAvailability, setFilterAvailability] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/menus?page=${currentPage}&limit=${limit}${debouncedSearch ? `&searchTerm=${debouncedSearch}` : ""}${filterAvailability ? `&isAvailable=${filterAvailability}` : ""}`,
  );

  const { mutate: deleteMenu, isLoading: isDeleting } = useDelete(
    "/menus",
    {
      revalidateKey: "/menus",
    },
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<IMenuItem | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterAvailability]);

  const handleView = (item: IMenuItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: IMenuItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert deleting menu item "${name}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#232156",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Deleting...",
            text: "Please wait",
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });

          await deleteMenu(id);

          Swal.fire({
            title: "Deleted!",
            text: `Menu item "${name}" has been deleted successfully.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          refetch();
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text:
              error.response?.data?.message ||
              "Failed to delete menu item",
            icon: "error",
          });
        }
      }
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterAvailability(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterAvailability("");
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const columns: ColumnDef<IMenuItem>[] = [
    {
      accessorKey: "name",
      header: "Menu Item",
      size: 300,
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
            {row.original.image ? (
              <img
                src={row.original.image}
                alt={row.original.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Utensils className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold">
                {row.getValue("name")}
              </div>
              {row.original.isFeatured && (
                <Badge variant="default" className="gap-1 bg-purple-500 hover:bg-purple-600">
                  Featured
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-1">
              {row.original.description}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-primary">
                ${row.original.price}
              </span>
              {row.original.discountPrice && (
                <span className="line-through">
                  ${row.original.discountPrice}
                </span>
              )}
              <span>·</span>
              <span>{row.original.categoryId?.name || "Uncategorized"}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {row.original.preparationTime} min
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 120,
      cell: ({ row }) => (
        <div>
          <div className="font-medium">${row.getValue("price")}</div>
          {row.original.discountPrice && (
            <div className="text-xs text-green-600">
              ${row.original.discountPrice}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isAvailable",
      header: "Status",
      size: 130,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isAvailable ? (
            <Badge
              variant="default"
              className="gap-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Unavailable
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "displayOrder",
      header: "Order",
      size: 80,
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("displayOrder")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 160,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center text-sm font-medium">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            {formatDate(row.getValue("createdAt"))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Updated: {formatDate(row.original.updatedAt)}
          </div>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 100,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-primary !p-0"
            onClick={() => handleView(row.original)}
            disabled={isDeleting}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary !p-0"
                disabled={isDeleting}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleEdit(row.original)}
                className="hover:text-white! hover:bg-primary!"
                disabled={isDeleting}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(row.original._id, row.original.name)}
                className="text-destructive hover:text-white! hover:bg-primary!"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number(newLimit));
    setCurrentPage(1);
  };

  if (isLoading) return <TableLoader />;

  const meta = data?.meta;
  const totalPages = meta?.totalPage || 1;
  const currentPageNum = meta?.page || 1;

  const isDataAvailable = (data?.data?.length as number) > 0;
  const hasActiveFilters = searchTerm || filterAvailability;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground mt-1">
            Manage your menu items
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total}{" "}
              menu items
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-white p-5"
        >
          Add Menu Item
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center justify-end gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select
            value={filterAvailability}
            onValueChange={handleFilterChange}
          >
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="true">Available</SelectItem>
              <SelectItem value="false">Unavailable</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3 text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      {!isDataAvailable ? (
        <MenusEmpty
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden border shadow-sm p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="text-left px-6 py-3 text-sm font-medium text-muted-foreground"
                        style={{ width: header.getSize() }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {isDataAvailable && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={String(limit)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(currentPageNum - 1)
                    }
                    className={
                      currentPageNum <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPageNum <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPageNum >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPageNum - 2 + i;
                    }

                    if (pageNumber < 1 || pageNumber > totalPages)
                      return null;

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => handlePageChange(pageNumber)}
                          isActive={pageNumber === currentPageNum}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  },
                )}

                {totalPages > 5 &&
                  currentPageNum < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                {totalPages > 5 &&
                  currentPageNum < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(currentPageNum + 1)
                    }
                    className={
                      currentPageNum >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      <CreateMenuModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={refetch}
      />
      <EditMenuModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        menu={itemToEdit}
        onSuccess={refetch}
      />
      <ViewMenuModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        menu={selectedItem}
      />
    </section>
  );
}