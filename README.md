# スタンプメーカー

Slack / Discord 用のカスタムスタンプ（絵文字）を簡単に作成できる Web アプリです。

## 機能

- 1〜4文字のテキストからスタンプ画像を生成
- 背景色・文字色をカラーピッカーまたはプリセットから選択
- 11種類の Google Fonts（日本語6種・英語5種）から選択
- フォントスタイル（Regular / Bold / Italic / Bold Italic）
- 形状（正方形 / 角丸）
- 背景透過 ON/OFF
- 出力サイズ（128px / 256px / 512px）
- 10種類のデザインプリセット
- 最近使ったフォント5件を記憶
- PNG ダウンロード

## 使い方

1. テキスト欄に1〜4文字を入力
2. プリセットを選ぶか、各項目を自由にカスタマイズ
3. プレビューを確認して「ダウンロード」ボタンをクリック
4. ダウンロードした PNG を Slack / Discord にアップロード

## ローカルで実行

ビルド不要です。`index.html` をブラウザで開くだけで動作します。

```bash
# 簡易サーバーで起動する場合
npx serve .
# または
python3 -m http.server 8000
```

## GitHub Pages でデプロイ

1. このリポジトリを GitHub に push
2. リポジトリの Settings > Pages > Source を `main` ブランチ / `/ (root)` に設定
3. 数分後に `https://ユーザー名.github.io/リポジトリ名/` で公開

## 技術スタック

- HTML + CSS + Vanilla JavaScript（フレームワーク不使用）
- HTML5 Canvas（画像生成）
- Google Fonts（Web フォント）
- localStorage（最近使ったフォントの記憶）

## Slack / Discord の仕様

| サービス | 推奨サイズ | 最大ファイルサイズ | 対応形式 |
|----------|-----------|-------------------|----------|
| Slack | 128x128px | 128KB | PNG, JPEG, GIF |
| Discord | 128x128px | 256KB | PNG, JPEG, GIF |

## ライセンス

MIT
