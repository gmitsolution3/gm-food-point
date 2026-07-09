"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePatch } from "@/hooks/swr/usePatch";
import { useFetch } from "@/hooks/swr/useFetch";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/image-uploader";
import { Utensils, Calendar, Clock } from "lucide-react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { IMenuItem, ICategory } from "@/types";
import { formatDate } from "@/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
  price: z.number().min(0, "Price must be at least 0"),
  discountPrice: z.number().min(0, "Discount price must be at least 0").nullable().optional(),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  displayOrder: z.number().min(1, "Display order must be at least 1"),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditMenuModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  menu: IMenuItem | null;
  onSuccess?: () => void;
}

export default function EditMenuModal({
  isModalOpen,
  setIsModalOpen,
  menu,
  onSuccess,
}: EditMenuModalProps) {
  const { mutate: patchData, isLoading } = usePatch("/menus", {
    revalidateKey: "/menus",
  });

  const { data: categoriesData } = useFetch<{ data: ICategory[] }>(
    "/categories?page=1&limit=100"
  );

  const categories = categoriesData?.data || [];

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
      description: "",
      categoryId: "",
      image: "",
      imagePublicId: "",
      price: 0,
      discountPrice: null,
      preparationTime: 15,
      displayOrder: 1,
      isAvailable: true,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (menu) {
      reset({
        name: menu.name,
        description: menu.description,
        categoryId: menu.categoryId?._id || "",
        image: menu.image || "",
        imagePublicId: "",
        price: menu.price,
        discountPrice: menu.discountPrice,
        preparationTime: menu.preparationTime,
        displayOrder: menu.displayOrder,
        isAvailable: menu.isAvailable,
        isFeatured: menu.isFeatured,
      });
    }
  }, [menu, reset]);

  const handleClose = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleImageChange = (url: string, publicId: string) => {
    setValue("image", url, { shouldValidate: true });
    setValue("imagePublicId", publicId, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    if (!menu) return;

    try {
      const { imagePublicId, ...submitData } = data;
      const payload = {
        ...submitData,
        discountPrice: data.discountPrice || null,
      };

      const response = await patchData({
        id: menu._id,
        data: payload,
      });

      if (response.success) {
        setIsModalOpen(false);
        reset();
        onSuccess?.();
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Menu item "${data.name}" has been updated.`,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update menu item. Please try again.",
      });
    }
  };

  const watchedName = watch("name");
  const watchedPrice = watch("price");
  const watchedDiscountPrice = watch("discountPrice");
  const watchedCategoryId = watch("categoryId");
  const watchedImage = watch("image");
  const watchedIsAvailable = watch("isAvailable");
  const watchedIsFeatured = watch("isFeatured");

  const selectedCategory = categories.find(c => c._id === watchedCategoryId);

  if (!menu) return null;

  return (
    <Dialog modal={false} open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Update menu item details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Image */}
            <div className="space-y-2">
              <Label>Item Image</Label>
              <ImageUploader
                value={watchedImage}
                onChange={handleImageChange}
              />
            </div>

            {/* Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Chicken Burger"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={watchedCategoryId}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your menu item..."
                rows={3}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Price & Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price ($)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("discountPrice", { valueAsNumber: true })}
                />
                {errors.discountPrice && (
                  <p className="text-sm text-destructive">{errors.discountPrice.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Leave empty for no discount</p>
              </div>
            </div>

            {/* Preparation Time & Display Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preparationTime">Preparation Time (minutes)</Label>
                <Input
                  id="preparationTime"
                  type="number"
                  placeholder="15"
                  {...register("preparationTime", { valueAsNumber: true })}
                />
                {errors.preparationTime && (
                  <p className="text-sm text-destructive">{errors.preparationTime.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  placeholder="1"
                  {...register("displayOrder", { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
                )}
                <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
              </div>
            </div>

            {/* Switches */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Available</p>
                  <p className="text-sm text-muted-foreground">Item is available for ordering</p>
                </div>
                <Switch
                  checked={watchedIsAvailable}
                  onCheckedChange={(checked) => setValue("isAvailable", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Featured</p>
                  <p className="text-sm text-muted-foreground">Show this item as featured</p>
                </div>
                <Switch
                  checked={watchedIsFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {watchedName && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h4 className="font-medium text-sm">Live Preview</h4>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                  {watchedImage ? (
                    <img
                      src={watchedImage}
                      alt={watchedName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Utensils className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold flex items-center gap-2">
                    {watchedName}
                    {watchedIsFeatured && (
                      <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium text-primary">${watchedPrice || 0}</span>
                    {watchedDiscountPrice && watchedDiscountPrice > 0 && (
                      <span className="line-through">${watchedDiscountPrice}</span>
                    )}
                    <span>·</span>
                    <span>{selectedCategory?.name || "Uncategorized"}</span>
                  </div>
                  <Badge variant={watchedIsAvailable ? "default" : "secondary"} className="text-xs">
                    {watchedIsAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          {menu && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created: {formatDate(menu.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {formatDate(menu.updatedAt)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                ID: {menu._id}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="text-white">
              Update Menu Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}