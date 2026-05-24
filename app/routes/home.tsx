import { ArrowRight, Heart, PawPrint, Shield, Star, Users } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { config } from "~/lib/config";
import { backendFetchWithRetry } from "~/lib/http.server";
import umaArai from "~/welcome/uma-arai.png";
import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "sample web app" },
    { name: "description", content: "Welcome to v2" },
  ];
}

export async function loader() {
  try {
    const res = await backendFetchWithRetry(
      new URL(`${config.api.backendUrl}/v1/helloworld`),
      undefined,
      {
        timeoutMs: 10_000,
        retries: 3,
      },
    );

    if (res.ok) {
      const json = (await res.json()) as { data: { message: string } };
      return { message: json.data.message };
    }
  } catch (error) {
    console.error("Error fetching data from backend:", error);
  }

  return { message: "Hello, API response cannot be used" };
}

function HeroSection({ message }: { message: string }) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-blue-50/90 to-sky-50 py-10">
      {/* Animated paw prints background */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/12 to-sky-300/15 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-sky-300/15 to-blue-400/15 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-32 left-32 w-28 h-28 bg-gradient-to-br from-cyan-300/15 to-blue-300/15 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-br from-primary/12 to-cyan-200/15 rounded-full blur-2xl animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4.5s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center h-full flex items-center">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  <PawPrint className="w-4 h-4" />
                  アライとウマのお店
                </Badge>

                {/* ここにWelcomeメッセージがはいります！！！ */}
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-[hsl(207_92%_45%)] to-sky-500 bg-clip-text text-transparent leading-loose">
                  {message}
                </h1>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  ショップへようこそ！
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/pets">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    ペットを探す
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary/35 text-primary hover:bg-primary/8 transition-all duration-300"
                  >
                    <PawPrint className="w-5 h-5 mr-2" />
                    ショップについて
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right side - Mascot Image */}
            <div className="flex-1 max-w-sm">
              <div className="relative">
                {/* Glowing effect around mascot */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-sky-400 rounded-full blur-3xl opacity-20 animate-pulse" />

                {/* Floating paw prints around mascot */}
                <div
                  className="absolute -top-4 -left-4 text-sky-300 animate-bounce"
                  style={{ animationDelay: "0s" }}
                >
                  <PawPrint className="w-5 h-5" />
                </div>
                <div
                  className="absolute -top-2 -right-6 text-blue-300 animate-bounce"
                  style={{ animationDelay: "1s" }}
                >
                  <PawPrint className="w-4 h-4" />
                </div>
                <div
                  className="absolute -bottom-4 -left-6 text-cyan-300 animate-bounce"
                  style={{ animationDelay: "2s" }}
                >
                  <PawPrint className="w-3 h-3" />
                </div>
                <div
                  className="absolute -bottom-2 -right-4 text-sky-300 animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                >
                  <PawPrint className="w-4 h-4" />
                </div>

                <div className="relative bg-gradient-to-br from-white to-blue-50/80 rounded-3xl p-6 shadow-2xl border border-primary/15">
                  <img
                    src={umaArai}
                    alt="uma-arai mascot - ペットショップのマスコット"
                    className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pet Shop Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Shield,
                title: "大リニューアル",
                desc: "最新の内容に合わせて全体を刷新",
                color: "text-green-600",
              },
              {
                icon: Users,
                title: "きめ細やかなイラスト",
                desc: "わかりやすいイラストで学びをサポート！",
                color: "text-primary",
              },
              {
                icon: Star,
                title: "アフターケア",
                desc: "購入後も安心のサポート体制",
                color: "text-teal-600",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-300 hover:shadow-lg group"
              >
                <CardContent className="p-4 text-center">
                  <div className="relative">
                    <feature.icon
                      className={`w-10 h-10 mx-auto mb-3 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                    <PawPrint className="w-3 h-3 absolute -top-1 -right-1 text-primary/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { message } = loaderData;

  return <HeroSection message={message} />;
}
