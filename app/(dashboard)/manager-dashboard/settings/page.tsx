"use client";

import SettingsLoader from "@/components/manager-dashboard/settings/SettingsLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFetch } from "@/hooks/swr/useFetch";
import { usePatch } from "@/hooks/swr/usePatch";
import { ISettings } from "@/types";
import { notify } from "@/utils";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SettingsResponse {
  data: ISettings;
}

export default function SettingsPage() {
  const { data, isLoading, refetch } =
    useFetch<SettingsResponse>("/settings");

  const { mutate: patchData, isLoading: isUpdating } = usePatch(
    "/settings",
    {
      revalidateKey: "/settings",
    },
  );

  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ISettings>();

  useEffect(() => {
    if (data?.data) {
      reset(data.data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: ISettings) => {
    try {
      const { _id, createdAt, updatedAt, ...payload } = formData;

      const response = await patchData({
        id: "update",
        data: payload,
      });

      if (response.success) {
        notify.success("Settings updated successfully!");
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      notify.error("Failed to update settings. Please try again.");
    }
  };

  if (isLoading) {
    return <SettingsLoader />;
  }

  const settings = data?.data;

  if (!settings) {
    return (
      <div className="container mx-auto px-5 lg:px-0 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No settings found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 lg:px-0 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your restaurant settings
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="text-white"
          >
            Edit Settings
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">
                    Restaurant Name
                  </Label>
                  <Input
                    id="restaurantName"
                    {...register("restaurantName")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    {...register("currency")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">
                    Contact Number
                  </Label>
                  <Input
                    id="contactNumber"
                    {...register("contactNumber")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={!isEditing || isUpdating}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Order Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumberPrefix">
                    Order Number Prefix
                  </Label>
                  <Input
                    id="orderNumberPrefix"
                    {...register("orderNumberPrefix")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTimeoutMinutes">
                    Payment Timeout (Minutes)
                  </Label>
                  <Input
                    id="paymentTimeoutMinutes"
                    type="number"
                    {...register("paymentTimeoutMinutes")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxPercentage">
                    Tax Percentage (%)
                  </Label>
                  <Input
                    id="taxPercentage"
                    type="number"
                    step="0.01"
                    {...register("taxPercentage")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceChargePercentage">
                    Service Charge Percentage (%)
                  </Label>
                  <Input
                    id="serviceChargePercentage"
                    type="number"
                    step="0.01"
                    {...register("serviceChargePercentage")}
                    disabled={!isEditing || isUpdating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Tax</p>
                      <p className="text-sm text-muted-foreground">
                        Apply tax to orders
                      </p>
                    </div>
                    <Switch
                      checked={watch("isTaxEnabled")}
                      onCheckedChange={(checked) =>
                        setValue("isTaxEnabled", checked)
                      }
                      disabled={!isEditing || isUpdating}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Enable Service Charge
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Apply service charge to orders
                      </p>
                    </div>
                    <Switch
                      checked={watch("isServiceChargeEnabled")}
                      onCheckedChange={(checked) =>
                        setValue("isServiceChargeEnabled", checked)
                      }
                      disabled={!isEditing || isUpdating}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restaurant Status */}
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Restaurant Open</p>
                  <p className="text-sm text-muted-foreground">
                    {watch("isRestaurantOpen")
                      ? "Restaurant is currently open"
                      : "Restaurant is currently closed"}
                  </p>
                </div>
                <Switch
                  checked={watch("isRestaurantOpen")}
                  onCheckedChange={(checked) =>
                    setValue("isRestaurantOpen", checked)
                  }
                  disabled={!isEditing || isUpdating}
                />
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-muted-foreground">
              <p>
                Created:{" "}
                {new Date(settings.createdAt).toLocaleString()}
              </p>
              <p>
                Last Updated:{" "}
                {new Date(settings.updatedAt).toLocaleString()}
              </p>
              <p>ID: {settings._id}</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (data?.data) {
                    reset(data.data);
                  }
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
