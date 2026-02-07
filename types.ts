
export type Locale = 'vi' | 'en' | 'zh' | 'ja' | 'ko';

export interface Category {
  id: string;
  name: Record<Locale, string>;
  groupId: 'religion' | 'genre' | 'era' | 'region';
}

export interface Artifact {
  id: string;
  name: string;
  short_description: string;
  description: string;
  categories: string[];
  main_image: string;
  supporting_images?: string[];
  sources?: string[];
  author: string;
  contributor: string;
  artifact_date: string;
  public_date: string; // dd-mm-yyyy
  location?: string; // Địa điểm hiện tại hoặc nơi tìm thấy
}

export interface CategoryGroup {
  id: 'religion' | 'genre' | 'era' | 'region';
  title: Record<Locale, string>;
  options: Category[];
}

export interface HistoryPeriod {
  name: Record<Locale, string>;
  start: string;
  end: string;
  capital?: Record<Locale, string>;
  nation_name?: Record<Locale, string>;
  desc?: Record<Locale, string>;
  type: 'independence' | 'occupation' | 'war';
}
