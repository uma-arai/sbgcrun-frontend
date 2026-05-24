export type NewsCategory =
  | "new_arrival"
  | "campaign"
  | "event"
  | "service"
  | "other";

export type News = {
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  author: string;
  createdAt: Date;
};

export type ServerNews = {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  created_at: string;
};

export type NewsResponse = {
  data: ServerNews[];
};
