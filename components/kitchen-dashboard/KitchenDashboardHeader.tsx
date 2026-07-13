"use client";

import useLogout from "@/hooks/useLogout";
import { useSession } from "@/lib/auth-context";
import { getUserInitials } from "@/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

export default function KitchenDashboardHeader() {
  const { session } = useSession();

  const user = session?.user;

  const { handleLogout } = useLogout();

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="block">
            <Image
              src="/images/logo.png"
              height={200}
              width={200}
              alt="Logo"
              className="w-24"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🍳 Kitchen Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-time order management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
              <span className="text-xs text-gray-600 font-medium">
                Queued
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
              <span className="text-xs text-gray-600 font-medium">
                Cooking
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full"></span>
              <span className="text-xs text-gray-600 font-medium">
                Ready
              </span>
            </div>
          </div>

          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 !px-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"user?.image"} />
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {getUserInitials(user?.name || "Kitchen")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
