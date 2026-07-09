import { DashboardMenu } from "@/utils";
import {
  Banknote,
  CircleUser,
  ConciergeBell,
  Hamburger,
  LayoutDashboard,
  List,
  Settings,
  UserRoundSearch,
} from "lucide-react";

const baseDashboardUrl = "/manager-dashboard";
const dashboardMenu = new DashboardMenu(baseDashboardUrl);

export const mainMenuItems = [
  {
    title: "Dashboard",
    url: dashboardMenu.defineUrl("/"),
    icon: LayoutDashboard,
  },
  {
    title: "categories",
    url: dashboardMenu.defineUrl("/categories"),
    icon: List,
  },
  {
    title: "menus",
    url: dashboardMenu.defineUrl("/menus"),
    icon: Hamburger,
  },
  {
    title: "orders",
    url: dashboardMenu.defineUrl("/orders"),
    icon: ConciergeBell,
  },
  {
    title: "payments",
    url: dashboardMenu.defineUrl("/payments"),
    icon: Banknote,
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
