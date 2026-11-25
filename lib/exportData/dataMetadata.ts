import { getCategoryNames } from "@/lib/consts/categories";

export const FULL_HEADERS: { key: string; label: string; dictKey?: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name", dictKey: "download_field_name" },
  { key: "short_description", label: "Short Description", dictKey: "download_field_short_desc" },
  { key: "description", label: "Description", dictKey: "artifact_desc" },
  { key: "categories", label: "Categories", dictKey: "filter_cats" },
  { key: "main_image", label: "Main Image URL", dictKey: "download_field_main_image" },
  { key: "supporting_images", label: "Supporting Images", dictKey: "download_field_supporting_images" },
  { key: "author", label: "Author", dictKey: "artifact_author" },
  { key: "contributor", label: "Contributor", dictKey: "artifact_contributor" },
  { key: "artifact_date", label: "Artifact Era", dictKey: "artifact_date" },
  { key: "public_date", label: "Public Date", dictKey: "artifact_public_date" },
  { key: "location", label: "Location", dictKey: "artifact_location" },
  { key: "collections", label: "Collections", dictKey: "nav_collection" },
];

export const FIELD_CONTENT_MAP = {
  id: (a: any) => a.id,
  name: (a: any) => a.name,
  short_description: (a: any) => a.short_description,
  description: (a: any) => a.description,
  categories: (a: any) => getCategoryNames(a.categories, "vi"),
  main_image: (a: any) => a.main_image,
  supporting_images: (a: any) => (a.supporting_images || []).join("; "),
  author: (a: any) => a.author,
  contributor: (a: any) => a.contributor,
  artifact_date: (a: any) => a.artifact_date,
  public_date: (a: any) => a.public_date,
  location: (a: any) => a.location,
  collections: (a: any) => (a.collections || []).join(", "),
};
