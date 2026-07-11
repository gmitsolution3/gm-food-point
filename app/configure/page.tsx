"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart-store";
import { Check, Save, Table } from "lucide-react";
import { useEffect, useState } from "react";
import { getTableNumber, setTableNumber as setTableNumberInStorage } from "@/utils";

export default function ConfigurePage() {
  const [tableNumber, setTableNumber] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const { orderType } = useCart();

  // Load table number from localStorage on mount
  useEffect(() => {
    const savedTable = getTableNumber();

    if (savedTable) {
      setTableNumber(savedTable);
    } else {
      setTableNumber("1");
    }
  }, []);

  const handleSave = () => {
    if (tableNumber.trim()) {
      setTableNumberInStorage(tableNumber.trim());
      setSaved(true);
      
      // Hide the success message after 3 seconds
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-[var(--shadow-lift)] border-0">
          <CardHeader className="text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary mb-2">
              <Table className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl font-extrabold">
              Table Configuration
            </CardTitle>
            <CardDescription>
              Set your table number for dine-in orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber" className="text-sm font-semibold">
                Table Number
              </Label>
              <Input
                id="tableNumber"
                type="number"
                placeholder="Enter your table number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12 text-lg font-bold rounded-2xl border-border bg-card focus:shadow-[var(--shadow-soft)] focus:ring-2 focus:ring-primary/40"
                min="1"
                max="99"
              />
              <p className="text-xs text-muted-foreground">
                This will be used for all your dine-in orders.
              </p>
            </div>

            {saved && (
              <div className="flex items-center gap-2 rounded-2xl bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                <Check className="h-4 w-4" />
                <span>Table number saved successfully!</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={handleSave}
              className="w-full rounded-full h-12 text-base font-extrabold shadow-[var(--shadow-yellow)] hover:bg-primary/90"
              disabled={!tableNumber.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Table Number
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Current order type: {orderType === "dine-in" ? "Dine In" : orderType === "take-out" ? "Take Out" : "Not set"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}