"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, Edit } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/form-schema/ProfileFormSchema";
import { IUser } from "@/types";

interface ProfileLeftCardProps {
  user: IUser;
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  isImageDialogOpen: boolean;
  setIsImageDialogOpen: (open: boolean) => void;
}

export default function ProfileLeftCard({
  user,
  form,
  isEditing,
  isImageDialogOpen,
  setIsImageDialogOpen,
}: ProfileLeftCardProps) {
  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
      manager: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
      cashier: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      kitchen: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
      user: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
    };

    return roleColors[role?.toLowerCase()] || roleColors.user;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/10">
              <AvatarImage
                src={form.watch("image") || user.image || ""}
                alt={user.name}
              />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                variant="outline"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                onClick={() => setIsImageDialogOpen(true)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Name & Role */}
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <Badge
              className={`mt-1 capitalize ${getRoleBadge(user.role)}`}
              variant="outline"
            >
              {user.role || "User"}
            </Badge>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{user.email}</span>
          </div>

          {/* Email Verified Status */}
          <div className="flex items-center gap-2">
            {user.emailVerified ? (
              <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                <span className="h-2 w-2 rounded-full bg-white" />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Not Verified
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="w-full pt-4 border-t text-xs text-muted-foreground space-y-1">
            <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
            <div>ID: {user._id}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}