import { apiRequest } from "@/services/api";
import type { Category } from "@/types/category";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export function getCategories() {
  return apiRequest<Category[]>("/api/categories");
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiRequest<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
