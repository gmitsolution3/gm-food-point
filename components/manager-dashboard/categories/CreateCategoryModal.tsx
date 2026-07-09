"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePost } from "@/hooks/swr/usePost";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tag } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import * as z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Name too long (max 50 characters)")
    .regex(
      /^[a-zA-Z0-9\s\-']+$/,
      "Name can only contain letters, numbers, spaces, hyphens, and apostrophes",
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCategoryModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateCategoryModal({
  isModalOpen,
  setIsModalOpen,
  onSuccess,
}: CreateCategoryModalProps) {
  const { mutate: postData, isLoading } = usePost("/categories", {
    revalidateKey: "/categories",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

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
    try {
      const payload = {
        name: data.name,
      };

      const response = await postData(payload);

      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Category "${data.name}" has been created.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to create category. Please try again.",
      });
    }
  };

  const watchedName = watch("name");
  const generatedSlug = watchedName ? generateSlug(watchedName) : "";

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Add a new category to your system.
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
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {watchedName && (
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
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {watchedName ? "Valid" : "Incomplete"}
                </Badge>
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
            <Button
              type="submit"
              disabled={isLoading}
              className="text-white"
            >
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
