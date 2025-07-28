import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().min(1, "Tên bộ sưu tập là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  description: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  categoryId: z.string().optional(),
});

export type CollectionFormData = z.infer<typeof collectionSchema>;
