"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/form-schema/ProfileFormSchema";
import { User, Save, X } from "lucide-react";
import { IUser } from "@/types";

interface ProfileRightCardProps {
  user: IUser;
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  isLoading: boolean;
  onSubmit: (data: ProfileFormValues) => void;
  setIsImageDialogOpen: (open: boolean) => void;
}

export default function ProfileRightCard({
  user,
  form,
  isEditing,
  setIsEditing,
  isLoading,
  onSubmit,
  setIsImageDialogOpen,
}: ProfileRightCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your personal information
          </p>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name")}
                disabled={!isEditing || isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={true}
                className="bg-muted/50 cursor-not-allowed"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>

            {/* Role (Read Only) */}
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="px-3 py-2 rounded-md border bg-muted/50 text-sm capitalize">
                {user.role || "User"}
              </div>
              <p className="text-xs text-muted-foreground">
                Role is assigned by administrators
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  form.reset({
                    name: user.name,
                    email: user.email,
                    image: user.image || "",
                    imagePublicId: user.imagePublicId || "",
                  });
                }}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="text-white">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}