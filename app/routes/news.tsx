import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar,
  Megaphone,
  Newspaper,
  PawPrint,
  Scissors,
  Tag,
  User,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { config } from "~/lib/config";
import { backendFetchWithRetry } from "~/lib/http.server";
import type {
  News,
  NewsCategory,
  NewsResponse,
  ServerNews,
} from "~/types/news";
import type { Route } from "./+types/news";

export function meta() {
  return [
    { title: "お知らせ - uma-arai Cloud Run shop" },
    { name: "description", content: "お店からの最新ニュースをお届けします" },
  ];
}

function toNewsCategory(category: string): NewsCategory {
  switch (category) {
    case "new_arrival":
    case "campaign":
    case "event":
    case "service":
      return category;
    default:
      return "other";
  }
}

function convertServerNewsToClient(serverNews: ServerNews[]): News[] {
  return serverNews.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    category: toNewsCategory(n.category),
    author: n.author,
    createdAt: new Date(n.created_at),
  }));
}

export async function loader() {
  try {
    const response = await backendFetchWithRetry(
      new URL(`${config.api.backendUrl}/v1/news`),
      undefined,
      { timeoutMs: 10_000, retries: 3 },
    );

    if (response.ok) {
      const data: NewsResponse = await response.json();
      const news = convertServerNewsToClient(data.data);
      news.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return { news, total: news.length, error: null as string | null };
    }
    console.warn(`API Error: ${response.status} ${response.statusText}`);
    return {
      news: [],
      total: 0,
      error: `取得に失敗しました`,
    };
  } catch (error) {
    console.warn("Failed to fetch news from server:", error);
    return {
      news: [],
      total: 0,
      error: "データの取得に失敗しました",
    };
  }
}

function getCategoryIcon(category: NewsCategory) {
  switch (category) {
    case "new_arrival":
      return <PawPrint className="h-5 w-5 text-primary" />;
    case "campaign":
      return <Tag className="h-5 w-5 text-red-500" />;
    case "event":
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case "service":
      return <Scissors className="h-5 w-5 text-green-500" />;
    default:
      return <Megaphone className="h-5 w-5 text-muted-foreground" />;
  }
}

function getCategoryLabel(category: NewsCategory): string {
  switch (category) {
    case "new_arrival":
      return "新入荷";
    case "campaign":
      return "キャンペーン";
    case "event":
      return "イベント";
    case "service":
      return "サービス";
    default:
      return "お知らせ";
  }
}

function getCategoryBadgeVariant(
  category: NewsCategory,
): "default" | "secondary" | "destructive" | "outline" {
  switch (category) {
    case "new_arrival":
      return "default";
    case "campaign":
      return "destructive";
    case "event":
      return "secondary";
    case "service":
      return "outline";
    default:
      return "outline";
  }
}

function NewsItem({ news }: { news: News }) {
  const timeAgo = formatDistanceToNow(news.createdAt, {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="mt-1">{getCategoryIcon(news.category)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-lg font-semibold">{news.title}</h2>
              <Badge
                variant={getCategoryBadgeVariant(news.category)}
                className="text-xs"
              >
                {getCategoryLabel(news.category)}
              </Badge>
            </div>
            <p className="text-foreground mb-3 whitespace-pre-wrap">
              {news.content}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {news.author}
              </span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NewsPage({ loaderData }: Route.ComponentProps) {
  const news = loaderData?.news ?? [];
  const total = loaderData?.total ?? 0;
  const error = loaderData?.error ?? null;
  const hasError = error !== null;
  const hasNews = news.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">お知らせ</h1>
            <p className="text-muted-foreground mt-1">
              {hasError
                ? "お知らせの読み込みに失敗しました"
                : hasNews
                  ? `${total}件のお知らせがあります`
                  : "現在お知らせはありません"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {hasError ? (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold text-destructive mb-2">
                お知らせの取得に失敗しました
              </h2>
              <p className="text-foreground/90 mb-2">{error}</p>
              <p className="text-sm text-muted-foreground mb-6">
                時間をおいて再度お試しください。問題が続く場合はサービス提供者にお問い合わせください。
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.reload();
                }}
              >
                再読み込み
              </Button>
            </CardContent>
          </Card>
        ) : !hasNews ? (
          <Card className="text-center py-12">
            <CardContent>
              <Newspaper className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
              <h2 className="text-xl font-semibold text-muted-foreground mb-2">
                お知らせはありません
              </h2>
              <p className="text-muted-foreground/90">
                新しいお知らせが届くとここに表示されます
              </p>
            </CardContent>
          </Card>
        ) : (
          news.map((item) => <NewsItem key={item.id} news={item} />)
        )}
      </div>
    </div>
  );
}
