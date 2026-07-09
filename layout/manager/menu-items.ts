import { DashboardMenu } from "@/utils";
import {
  CircleUser,
  LayoutDashboard,
  Settings,
  UserRoundSearch,
  List,
  Earth,
  Banknote,
  Plane,
  Hamburger
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
