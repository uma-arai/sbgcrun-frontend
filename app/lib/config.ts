/**
 * アプリケーション設定
 * 環境変数から読み込む設定値を一元管理します
 */

const backendUrl = process.env.BACKEND_URL || "http://localhost:8081";
const isDevelopment = process.env.NODE_ENV === "development";

function resolveIdTokenAudience(): string | undefined {
  if (process.env.BACKEND_ID_TOKEN_AUDIENCE) {
    return process.env.BACKEND_ID_TOKEN_AUDIENCE;
  }
  // ローカル開発では Cloud Run 等の OIDC 検証が不要なので audience を付けない。
  if (isDevelopment) {
    return undefined;
  }
  return backendUrl + "/";
}

export const config = {
  api: {
    backendUrl,
    /**
     * バックエンド Cloud Run 等へ送る OIDC ID トークンの audience。
     * 未指定時は backendUrl を使う。ローカル開発時は undefined。
     */
    idTokenAudience: resolveIdTokenAudience(),
  },
};

console.log(config.api.backendUrl);
