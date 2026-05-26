import { apiRequest } from "@/services/api";
import type { Category } from "@/types/category";

export function getCategories() {
  return apiRequest<Category[]>("/api/categories");
}
