"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePatch } from "@/hooks/swr/usePatch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tag, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { ICategory } from "@/types";
import { formatDate } from "@/utils";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Name too long (max 50 characters)")
    .regex(/^[a-zA-Z0-9\s\-']+$/, "Name can only contain letters, numbers, spaces, hyphens, and apostrophes"),
  displayOrder: z
    .number()
    .min(1, "Display order must be at least 1")
    .int("Display order must be a whole number"),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  category: ICategory | null;
  onSuccess?: () => void;
}

export default function EditCategoryModal({
  isModalOpen,
  setIsModalOpen,
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/categories", {
    revalidateKey: "/categories",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      displayOrder: 1,
      isActive: true,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
      });
    }
  }, [category, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const onSubmit = async (data: FormValues) => {
    if (!category) return;

    try {
      const payload = {
        name: data.name,
        displayOrder: data.displayOrder,
        isActive: data.isActive,
      };

      const response = await patchData({
        id: category._id,
        data: payload,
      });

      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Category "${data.name}" has been updated.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update category. Please try again.",
      });
    }
  };

  const watchedName = watch("name");
  const watchedDisplayOrder = watch("displayOrder");
  const watchedIsActive = watch("isActive");
  const generatedSlug = watchedName ? generateSlug(watchedName) : "";

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update category details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Pizza, Burger, Drink"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                placeholder="e.g., 1, 2, 3"
                {...register("displayOrder", { valueAsNumber: true })}
              />
              {errors.displayOrder && (
                <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Lower numbers appear first in the list
              </p>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={watchedIsActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <span className="text-sm">
                  {watchedIsActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Toggle to activate or deactivate this category
              </p>
            </div>
          </div>

          {(watchedName || watchedDisplayOrder) && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h4 className="font-medium text-sm">Live Preview</h4>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">
                    {watchedName || "Category name"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Slug: {generatedSlug || "---"}</span>
                    <span>·</span>
                    <span>Order: {watchedDisplayOrder || "---"}</span>
                  </div>
                </div>
                <Badge
                  variant={watchedIsActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {watchedIsActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          )}

          {category && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {formatDate(category.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {formatDate(category.updatedAt)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Slug: {category.slug}</span>
                <span>·</span>
                <span>ID: {category._id}</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="text-white">
              Update Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}