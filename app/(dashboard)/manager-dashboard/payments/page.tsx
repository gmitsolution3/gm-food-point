"use client";

import PaymentsEmpty from "@/components/manager-dashboard/payments/PaymentsEmpty";
import ViewPaymentModal from "@/components/manager-dashboard/payments/ViewPaymentModal";
import TableLoader from "@/components/TableLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { useDebounce } from "@/hooks/useDebounce";
import { IPagination, IPayment } from "@/types";
import { formatDate } from "@/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  X,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";

interface ApiResponse {
  data: IPayment[];
  meta: IPagination;
}

const formatDateToAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function AdminPaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("");
  const [filterBusinessDate, setFilterBusinessDate] = useState<Date | undefined>(undefined);
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Format date for API
  const formattedBusinessDate = filterBusinessDate
    ? formatDateToAPI(filterBusinessDate)
    : "";

  const { data, isLoading } = useFetch<ApiResponse>(
    `/payments?page=${currentPage}&limit=${limit}${debouncedSearch ? `&searchTerm=${debouncedSearch}` : ""}${filterStatus ? `&status=${filterStatus}` : ""}${filterPaymentMethod ? `&paymentMethod=${filterPaymentMethod}` : ""}${formattedBusinessDate ? `&businessDate=${formattedBusinessDate}` : ""}`
  );

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IPayment | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus, filterPaymentMethod, filterBusinessDate]);

  const handleView = (item: IPayment) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handlePaymentMethodChange = (value: string) => {
    setFilterPaymentMethod(value);
    setCurrentPage(1);
  };

  const handleBusinessDateChange = (date: Date | undefined) => {
    setFilterBusinessDate(date);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterPaymentMethod("");
    setFilterBusinessDate(undefined);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: any;
        label: string;
      }
    > = {
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
      },
      paid: {
        variant: "default",
        icon: CheckCircle,
        label: "Paid",
      },
      failed: {
        variant: "destructive",
        icon: XCircle,
        label: "Failed",
      },
      refunded: {
        variant: "outline",
        icon: AlertCircle,
        label: "Refunded",
      },
    };

    const statusInfo = statusMap[status.toLowerCase()] || statusMap.pending;
    const Icon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="gap-1 capitalize">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const columns: ColumnDef<IPayment>[] = [
    {
      accessorKey: "orderNumber",
      header: "Order",
      size: 200,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="font-mono text-sm font-medium">
            {row.getValue("orderNumber")}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            ID: {row.original._id.slice(-6)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      size: 120,
      cell: ({ row }) => (
        <div className="font-medium">
          ${row.original.amount.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      size: 140,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize flex items-center gap-1">
          <CreditCard className="h-3 w-3" />
          {row.original.paymentMethod || "N/A"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 130,
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "businessDate",
      header: "Business Date",
      size: 130,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.businessDate}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 160,
      cell: ({ row }) => (
        <div>
          <div className="flex items-center text-sm">
            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
            {formatDate(row.getValue("createdAt"))}
          </div>
          {row.original.confirmedAt && (
            <div className="text-xs text-muted-foreground mt-0.5">
              Confirmed: {formatDate(row.original.confirmedAt)}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      size: 80,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:text-primary !p-0"
            onClick={() => handleView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:text-primary !p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => handleView(row.original)}
                className="hover:text-white! hover:bg-primary!"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
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
  const hasActiveFilters = searchTerm || filterStatus || filterPaymentMethod || filterBusinessDate;

  return (
    <section className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">
            Manage all payments
          </p>
          {meta && (
            <p className="text-sm text-muted-foreground mt-1">
              Showing {data?.data?.length || 0} of {meta.total} payments
            </p>
          )}
        </div>
      </div>

      {/* Search and Date Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm w-full sm:w-auto">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
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

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <DatePicker
            value={filterBusinessDate}
            onChange={handleBusinessDateChange}
            placeholder="Filter by date"
            className="w-[180px]"
          />
        </div>

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

      {/* Filter Row - Right Aligned */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium whitespace-nowrap">Filters:</span>
        </div>

        {/* Status Filter */}
        <Select value={filterStatus} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Method Filter */}
        <Select value={filterPaymentMethod} onValueChange={handlePaymentMethodChange}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="online">Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!isDataAvailable ? (
        <PaymentsEmpty />
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

      <ViewPaymentModal
        isModalOpen={isDetailModalOpen}
        setIsModalOpen={setIsDetailModalOpen}
        payment={selectedItem}
      />
    </section>
  );
}