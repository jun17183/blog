export interface PostMeta {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  series: string | null;
  thumbnail: string | null;
  published: boolean;
}
