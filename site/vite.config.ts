import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages（main ブランチ・ルートの index.html を直接配信）向け。
// 開発は site/ で行い、ビルド成果物をリポジトリ直上（..）へ出力。
// ルートの CNAME / .git / assets / 昔 / site を消さないよう emptyOutDir:false。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // 独自ドメイン（opepe-lp.emtrip.io）配信なのでルート基準
  build: {
    outDir: "..",
    emptyOutDir: false,
  },
});
