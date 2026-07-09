"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IMenuItem } from "@/types";
import { formatDate } from "@/utils";
import {
  Calendar,
  Clock,
  Utensils,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Star,
  Package,
} from "lucide-react";
import Image from "next/image";

interface ViewMenuModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  menu: IMenuItem | null;
}

export default function ViewMenuModal({
  isModalOpen,
  setIsModalOpen,
  menu,
}: ViewMenuModalProps) {
  if (!menu) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Menu Item Details</DialogTitle>
          <DialogDescription>
            View complete menu item information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Image */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
              {menu.image ? (
                <img
                  src={menu.image}
                  alt={menu.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Utensils className="h-10 w-10 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-semibold">{menu.name}</h3>
                {menu.isFeatured && (
                  <Badge variant="default" className="gap-1 bg-purple-500 hover:bg-purple-600">
                    <Star className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {menu.categoryId?.name || "Uncategorized"}
                </Badge>
                {menu.isAvailable ? (
                  <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-3 w-3" />
                    Available
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    Unavailable
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {menu.description}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Price</div>
              <div className="font-medium flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {menu.price}
                {menu.discountPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${menu.discountPrice}
                  </span>
                )}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Preparation Time</div>
              <div className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {menu.preparationTime} minutes
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Category</div>
              <div className="font-medium flex items-center gap-1">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {menu.categoryId?.name || "Uncategorized"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Display Order</div>
              <div className="font-medium">{menu.displayOrder}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div className="font-medium">
                {menu.isAvailable ? "Available" : "Unavailable"}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-xs text-muted-foreground mb-1">Featured</div>
              <div className="font-medium">
                {menu.isFeatured ? "Yes" : "No"}
              </div>
            </div>
            <div className="rounded-lg border p-3 col-span-2">
              <div className="text-xs text-muted-foreground mb-1">ID</div>
              <div className="font-medium font-mono text-sm">{menu._id}</div>
            </div>
          </div>

          {/* Suggested Items */}
          {menu.suggestedItems && menu.suggestedItems.length > 0 && (
            <div className="rounded-lg border p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Suggested Items ({menu.suggestedItems.length})
              </h4>
              <div className="space-y-2">
                {menu.suggestedItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Utensils className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${item.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
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
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}