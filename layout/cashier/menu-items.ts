import { DashboardMenu } from "@/utils";
import {
  CircleUser,
  LayoutDashboard,
  Settings,
  UserRoundSearch,
  List,
  Earth,
  Banknote,
  Plane
} from "lucide-react";

const baseDashboardUrl = "/cashier-dashboard";
const dashboardMenu = new DashboardMenu(baseDashboardUrl);

export const mainMenuItems = [
  {
    title: "Notifications",
    url: dashboardMenu.defineUrl("/"),
    icon: LayoutDashboard,
  },
  {
    title: "Category",
    url: dashboardMenu.defineUrl("/categories"),
    icon: List,
  },
  {
    title: "Country",
    url: dashboardMenu.defineUrl("/countries"),
    icon: Earth,
  },
  {
    title: "Pricing",
    url: dashboardMenu.defineUrl("/pricing"),
    icon: Banknote,
  },
  {
    title: "Bookings",
    url: dashboardMenu.defineUrl("/bookings"),
    icon: Plane,
  },
];

export const settingsItems = [
  {
    title: "Users",
    url: dashboardMenu.defineUrl("/users"),
    icon: UserRoundSearch,
  },
  {
    title: "Profile",
    url: dashboardMenu.defineUrl("/profile"),
    icon: CircleUser,
  },
  {
    title: "Settings",
    url: dashboardMenu.defineUrl("/settings"),
    icon: Settings,
  },
];
