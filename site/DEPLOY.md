# OPePe LP デプロイ手順（GitHub Pages）

OPePe LP は **GitHub Pages（main ブランチ・ルートの index.html を直接配信）** で公開しています。
Netlify ではありません。リポジトリ：`alibacchus/opepe-lp` / ドメイン：`opepe-lp.emtrip.io`

新LP（`site/` の React/Vite プロジェクト）を `vite build` し、成果物をリポジトリ直上（`outDir:".."`）に出力 → git push で自動公開されます。

---

## ⚠️ 公開前の注意

`vite build` を実行すると、リポジトリ直下が次のように変わります：
- ルートの `index.html`（旧・素HTML）→ **新LPのindex.htmlで上書き**
- ルートに `assets/index-xxxx.js` / `assets/index-xxxx.css` が追加される
- `site/public/assets/`（opepe-logo.png / action-photo.png）が ルート `assets/` にコピーされる
- **旧 `assets/`（旧LPが参照していた画像・動画）と同じ `assets/` フォルダに混在する**

→ 旧版を戻せるように、先に退避します。

---

## 手順（あなたの手元で実行）

```bash
# 0) プロジェクトへ
cd ~/opepe_lp

# 1) 旧版を退避（戻せるように・昔/ に precedent あり）
mkdir -p 昔/旧LP-html
mv index.html 昔/旧LP-html/index.html
mv assets     昔/旧LP-html/assets

# 2) 新LPをビルド（site/ の中で。outDir は ../ ＝リポジトリroot）
cd ~/opepe_lp/site
npm run build

# 3) ルートに index.html と assets/ が出ていることを確認
cd ~/opepe_lp
ls -la index.html assets/   # ← index.html と assets/index-*.js / opepe-logo.png 等

# 4) ローカルで最終目視（任意・おすすめ）
cd ~/opepe_lp/site
npm run preview             # → 表示される localhost URL で本番相当を確認

# 5) コミット＆プッシュ（= GitHub Pages 自動公開）
cd ~/opepe_lp
git add -A
git commit -m "OPePe LP: React/Vite化・安心信頼軸にリブランディング"
git push

# 6) 1〜2分後、https://opepe-lp.emtrip.io/ で反映を確認
#    CNAME と noindex（入っていないこと）も確認
```

---

## ロールバック（戻したいとき）

```bash
cd ~/opepe_lp
git revert HEAD        # 直前のpushを取り消す（履歴を残す安全な戻し方）
git push
# または手元で：
rm index.html && rm -rf assets
mv 昔/旧LP-html/index.html index.html
mv 昔/旧LP-html/assets assets
git add -A && git commit -m "rollback to old LP" && git push
```

---

## 公開後にやること（任意・品質）

- `assets/action-photo.png`（1.5MB）と `opepe-logo.png`(25KB) は軽量化済みだが、
  さらに軽くするなら手元で WebP 化（Squoosh等）して差し替え＋index.html/Hero の参照を .webp に。
- OGP画像は現状 action-photo.png を流用。専用の 1200×630 OGP画像を作るとシェア見栄えUP。
- CTAフォーム（forms.gle/DAarxxYQjMd3R7fQA）は旧LPと同一。別フォームにするなら content.ts の contactForm を差し替え。
