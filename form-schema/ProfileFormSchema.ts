import * as z from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name too long"),
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  image: z.string().optional(),
  imagePublicId: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
