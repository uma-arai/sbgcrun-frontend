import { GoogleAuth } from "google-auth-library";
import { config } from "./config";

/**
 * バックエンド URL を audience とした GCP ID トークンを取得し、
 * fetch へ渡す Authorization ヘッダー用のフィールドを返す。
 * （Go の idtoken.NewClient(ctx, audience) に相当）
 *
 * ローカルや認証情報がない環境では取得に失敗するため、空オブジェクトを返して従来どおりヘッダーなしで呼び出す。
 */
export async function getBackendAuthorizationHeaders(): Promise<
  Record<string, string>
> {
  if (process.env.DISABLE_BACKEND_ID_TOKEN === "true") {
    return {};
  }

  const audience = config.api.idTokenAudience;
  if (!audience) {
    return {};
  }

  console.log("audience", audience);

  try {
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(audience);
    const headers = await client.getRequestHeaders();
    if (typeof Headers !== "undefined" && headers instanceof Headers) {
      return Object.fromEntries(headers.entries());
    }
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === "string" && value) {
        out[key] = value;
      } else if (Array.isArray(value) && value[0]) {
        out[key] = value[0];
      }
    }
    return out;
  } catch (error) {
    console.warn(
      "[backend-id-token] ID トークンを取得できませんでした。Authorization なしでリクエストします:",
      error,
    );
    return {};
  }
}
