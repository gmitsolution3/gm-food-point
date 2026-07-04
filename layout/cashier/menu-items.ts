import { DashboardMenu } from "@/utils";
import { Bell, CircleUser, ClockArrowDown } from "lucide-react";

const baseDashboardUrl = "/cashier-dashboard";
const dashboardMenu = new DashboardMenu(baseDashboardUrl);

export const mainMenuItems = [
  {
    title: "Payment Requests",
    url: dashboardMenu.defineUrl("/"),
    icon: Bell,
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
