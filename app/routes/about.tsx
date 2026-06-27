import { data } from "react-router";
import { config } from "~/lib/config";
import { backendFetchWithRetry } from "~/lib/http.server";
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
      new URL(`${config.api.backendUrl}/v1/helloworld/error`),
      undefined,
      { timeoutMs: 10_000, retries: 3 },
    );

    if (res.ok) {
      const json = (await res.json()) as { data: { message: string } };
      return { message: json.data.message };
    }
    console.warn(`API Error: ${res.status} ${res.statusText}`);
    return data({ message: "about info is not found" }, { status: res.status });
  } catch (error) {
    console.error("some error occurred", error);
    return data({ message: "about info is not found" }, { status: 503 });
  }
}

export default function About({ loaderData }: Route.ComponentProps) {
  const { message } = loaderData;
  return (
    <div>
      <h1>About</h1>
      <p>{message}</p>
    </div>
  );
}
