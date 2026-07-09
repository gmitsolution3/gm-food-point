"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/swr/useFetch";
import { formatCurrency } from "@/utils";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertCircle,
  Coffee,
  CheckCircle,
  Users,
  Utensils,
  Tag,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface FinanceData {
  range: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  cashRevenue: number;
  wechatRevenue: number;
}

interface StatisticsData {
  orders: {
    totalToday: number;
    awaitingPayment: number;
    queued: number;
    cooking: number;
    ready: number;
    completedToday: number;
  };
  payments: {
    pending: number;
  };
  resources: {
    users: number;
    menus: number;
    categories: number;
  };
  charts: {
    weeklyRevenue: Array<{ date: string; revenue: number }>;
    weeklyOrders: Array<{ date: string; orders: number }>;
  };
}

interface FinanceResponse {
  data: FinanceData;
}

interface StatisticsResponse {
  data: StatisticsData;
}

const COLORS = {
  cash: "#22c55e",
  wechat: "#3b82f6",
  pending: "#ef4444",
  awaiting: "#eab308",
  queued: "#3b82f6",
  cooking: "#f97316",
  ready: "#22c55e",
  completed: "#10b981",
  revenue: "#22c55e",
  orders: "#3b82f6",
};

export default function AdminDashboardPage() {
  const [range, setRange] = useState<string>("7days");

  const { data: financeData, isLoading: financeLoading } = useFetch<FinanceResponse>(
    `/dashboard/finance?range=${range}`
  );

  const { data: statisticsData, isLoading: statisticsLoading } = useFetch<StatisticsResponse>(
    "/dashboard/statistics"
  );

  const isLoading = financeLoading || statisticsLoading;

  const finance = financeData?.data;
  const stats = statisticsData?.data;

  // Prepare weekly revenue data
  const weeklyRevenueData = stats?.charts?.weeklyRevenue || [];
  const weeklyOrdersData = stats?.charts?.weeklyOrders || [];

  // Prepare order status data for bar chart
  const orderStatusData = [
    { name: "Awaiting Payment", value: stats?.orders.awaitingPayment || 0, color: COLORS.awaiting },
    { name: "Queued", value: stats?.orders.queued || 0, color: COLORS.queued },
    { name: "Cooking", value: stats?.orders.cooking || 0, color: COLORS.cooking },
    { name: "Ready", value: stats?.orders.ready || 0, color: COLORS.ready },
    { name: "Completed", value: stats?.orders.completedToday || 0, color: COLORS.completed },
  ].filter((item) => item.value > 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 lg:px-0 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-muted rounded animate-pulse" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-muted rounded" />
                <div className="h-3 w-24 bg-muted rounded mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-8">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-32 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3 mt-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!finance || !stats) {
    return (
      <div className="container mx-auto px-5 lg:px-0 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Failed to load dashboard data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rangeOptions = [
    { value: "today", label: "Today" },
    { value: "7days", label: "7 Days" },
    { value: "15days", label: "15 Days" },
    { value: "1month", label: "1 Month" },
    { value: "3months", label: "3 Months" },
    { value: "6months", label: "6 Months" },
    { value: "1year", label: "1 Year" },
  ];

  return (
    <div className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your restaurant performance
          </p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {rangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Financial Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Financial</h2>
          <Badge variant="outline" className="ml-2">
            {rangeOptions.find((r) => r.value === range)?.label || range}
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(finance.totalRevenue)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Cash: {formatCurrency(finance.cashRevenue)}</span>
                </div>
                {finance.wechatRevenue > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>WeChat: {formatCurrency(finance.wechatRevenue)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{finance.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total orders in this period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(finance.averageOrderValue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per order average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          {/* Revenue Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
              <p className="text-xs text-muted-foreground">Daily revenue over the selected period</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyRevenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Orders Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Weekly Orders</CardTitle>
              <p className="text-xs text-muted-foreground">Daily orders over the selected period</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOrdersData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {weeklyOrdersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.orders > 0 ? "#3b82f6" : "#94a3b8"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Operations Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Operations</h2>
        </div>

        {/* Order Status Distribution Chart */}
        {orderStatusData.length > 0 ? (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Order Status Distribution</CardTitle>
              <p className="text-xs text-muted-foreground">Current order status breakdown</p>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Order Status Distribution</CardTitle>
              <p className="text-xs text-muted-foreground">Current order status breakdown</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No orders to display
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders.totalToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Orders today</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/20 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Awaiting Payment</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.orders.awaitingPayment}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Queued</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.orders.queued}
              </div>
              <p className="text-xs text-muted-foreground mt-1">In queue</p>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cooking</CardTitle>
              <Coffee className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.orders.cooking}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Being prepared</p>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.orders.ready}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready to serve</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.orders.completedToday}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed today</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments */}
        <div className="mt-4">
          <Card className="border-red-500/20 bg-red-50/50 dark:bg-red-950/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Wallet className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.payments.pending}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Payments waiting for confirmation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Resources</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resources.users}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menus</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resources.menus}</div>
              <p className="text-xs text-muted-foreground mt-1">Total menu items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resources.categories}</div>
              <p className="text-xs text-muted-foreground mt-1">Product categories</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}