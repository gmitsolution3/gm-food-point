"use client";

import { Button } from "@/components/ui/button";

interface MenusEmptyProps {
  onCreateClick: () => void;
  isDeleting?: boolean;
}

export default function MenusEmpty({
  onCreateClick,
  isDeleting = false,
}: MenusEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <span className="text-2xl">🍽️</span>
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">No menu items found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          Get started by adding your first menu item.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onCreateClick}
        disabled={isDeleting}
      >
        Add Menu Item
      </Button>
    </div>
  );
}