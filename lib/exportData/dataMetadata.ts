import { getCategoryNames } from "@/lib/consts/categories";

export const FULL_HEADERS: { key: string; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "short_description", label: "Short Description" },
  { key: "description", label: "Description" },
  { key: "categories", label: "Categories" },
  { key: "main_image", label: "Main Image URL" },
  { key: "supporting_images", label: "Supporting Images" },
  { key: "author", label: "Author" },
  { key: "contributor", label: "Contributor" },
  { key: "artifact_date", label: "Artifact Era" },
  { key: "public_date", label: "Public Date" },
  { key: "location", label: "Location" },
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
};
