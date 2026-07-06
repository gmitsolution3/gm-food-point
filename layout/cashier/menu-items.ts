import { DashboardMenu } from "@/utils";
import { Bell, CircleUser, ClockArrowDown, Coffee } from "lucide-react";

const baseDashboardUrl = "/cashier-dashboard";
const dashboardMenu = new DashboardMenu(baseDashboardUrl);

export const mainMenuItems = [
  {
    title: "Payment Requests",
    url: dashboardMenu.defineUrl("/"),
    icon: Bell,
  },
  {
    title: "Ready Orders",
    url: dashboardMenu.defineUrl("/ready-orders"),
    icon: Coffee,
  },
  {
    title: "All Payments",
    url: dashboardMenu.defineUrl("/all-payments"),
    icon: ClockArrowDown,
  },
];

export const settingsItems = [
  {
    title: "Profile",
    url: dashboardMenu.defineUrl("/profile"),
    icon: CircleUser,
  },
];
