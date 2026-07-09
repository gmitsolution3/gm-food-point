"use client";

import CategoriesEmpty from "@/components/manager-dashboard/categories/CategoriesEmpty";
import CreateCategoryModal from "@/components/manager-dashboard/categories/CreateCategoryModal";
import EditCategoryModal from "@/components/manager-dashboard/categories/EditCategoryModal";
import ViewCategoryModal from "@/components/manager-dashboard/categories/ViewCategoryModal";
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
import { useFetch } from "@/hooks/swr/useFetch";
import { useDelete } from "@/hooks/swr/useDelete";
import { ICategory, IPagination } from "@/types";
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
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

interface ApiResponse {
  data: ICategory[];
  meta: IPagination;
}

export default function AdminCategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const { data, isLoading, refetch } = useFetch<ApiResponse>(
    `/categories?page=${currentPage}&limit=${limit}${filterStatus ? `&isActive=${filterStatus}` : ""}`,
  );

  const { mutate: deleteCategory, isLoading: isDeleting } = useDelete(
    "/categories",
    {
      revalidateKey: "/categories",
    },
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICategory | null>(
    null,
  );
  const [itemToEdit, setItemToEdit] = useState<ICategory | null>(
    null,
  );

  const handleView = (item: ICategory) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (item: ICategory) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert deleting category "${name}"!`,
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

          await deleteCategory(id);

          Swal.fire({
            title: "Deleted!",
            text: `Category "${name}" has been deleted successfully.`,
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
              "Failed to delete category",
            icon: "error",
          });
        }
      }
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterStatus("");
    setCurrentPage(1);
  };

  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: "name",
      header: "Category",
      size: 300,
      cell: ({ row }) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="font-semibold">
                {row.getValue("name")}
              </div>
              <Badge variant="outline" className="text-xs">
                {row.original.slug}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Display Order: {row.original.displayOrder}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "displayOrder",
      header: "Display Order",
      size: 120,
      cell: ({ row }) => (
        <div className="font-medium text-start">
          {row.getValue("displayOrder")}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      size: 150,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isActive ? (
            <Badge
              variant="default"
              className="gap-1 bg-green-500 hover:bg-green-600"
            >
              <CheckCircle className="h-3 w-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 180,
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

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your categories
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total}{" "}
              categories
            </p>
          )}
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="text-white p-5"
        >
          Add Category
        </Button>
      </div>

      <div className="flex items-center justify-end gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <Select
          value={filterStatus}
          onValueChange={handleFilterChange}
        >
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {filterStatus && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="h-9 px-3 text-muted-foreground hover:text-foreground"
          >
            Clear filter
          </Button>
        )}
      </div>

      {!isDataAvailable ? (
        <CategoriesEmpty
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

      <CreateCategoryModal
        isModalOpen={isCreateModalOpen}
        setIsModalOpen={setIsCreateModalOpen}
        onSuccess={refetch}
      />
      <EditCategoryModal
        isModalOpen={isEditModalOpen}
        setIsModalOpen={setIsEditModalOpen}
        category={itemToEdit}
        onSuccess={refetch}
      />
      <ViewCategoryModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        category={selectedItem}
      />
    </section>
  );
}