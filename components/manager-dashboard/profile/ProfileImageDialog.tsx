"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/image-uploader";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "@/form-schema/ProfileFormSchema";

interface ProfileImageDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  form: UseFormReturn<ProfileFormValues>;
}

export default function ProfileImageDialog({
  isOpen,
  setIsOpen,
  form,
}: ProfileImageDialogProps) {
  const currentImage = form.watch("image") || "";
  const currentImagePublicId = form.watch("imagePublicId") || "";

  const [imageUrl, setImageUrl] = useState<string>(currentImage);
  const [imagePublicId, setImagePublicId] = useState<string>(currentImagePublicId);

  const handleImageChange = (url: string, publicId: string) => {
    setImageUrl(url);
    setImagePublicId(publicId);
  };

  const handleSave = () => {
    if (imageUrl) {
      form.setValue("image", imageUrl, { shouldValidate: true });
      form.setValue("imagePublicId", imagePublicId, { shouldValidate: true });
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setImageUrl(currentImage);
    setImagePublicId(currentImagePublicId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
          <DialogDescription>
            Upload a new profile picture. Recommended size: 400x400px.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-4xl text-muted-foreground">📷</span>
                </div>
              )}
            </div>
          </div>

          <ImageUploader
            value={imageUrl}
            imagePublicId={imagePublicId}
            onChange={handleImageChange}
          />

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={!imageUrl}
              className="text-white"
            >
              Save Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}