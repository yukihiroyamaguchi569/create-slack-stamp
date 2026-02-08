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

1. **リポジトリを GitHub に push**
   ```bash
   git remote add origin https://github.com/ユーザー名/リポジトリ名.git
   git branch -M main
   git push -u origin main
   ```

2. **GitHub で Pages を有効化**
   - リポジトリの **Settings** → 左メニュー **Pages**
   - **Source**: "Deploy from a branch" を選択
   - **Branch**: `main` を選択、フォルダは **/ (root)** のまま
   - **Save** をクリック

3. **公開URL**
   - 数分後（初回は 1〜2 分かかることがあります）に次のURLで公開されます。
   - `https://ユーザー名.github.io/リポジトリ名/`
   - 例: リポジトリ名が `stamp-maker` なら  
     `https://ユーザー名.github.io/stamp-maker/`

ビルドは不要で、リポジトリのルートにある `index.html` がそのまま配信されます。

### カスタムドメイン（conect.llc）を使う場合

1. **GitHub でドメインを設定**
   - リポジトリの **Settings** → **Pages** → **Custom domain** に次どちらかを入力
     - ルートドメイン: `conect.llc`
     - サブドメイン: `stamp.conect.llc` や `www.conect.llc` など
   - **Save** 後、表示に従って DNS の設定を行う
   - 問題なければ **Enforce HTTPS** にチェックを入れる（推奨）

2. **DNS（conect.llc の管理画面）で設定**

   **ルートドメイン（conect.llc）で使う場合**

   | タイプ | 名前（ホスト） | 値 |
   |--------|----------------|-----|
   | A     | `@`            | `185.199.108.153` |
   | A     | `@`            | `185.199.109.153` |
   | A     | `@`            | `185.199.110.153` |
   | A     | `@`            | `185.199.111.153` |

   **サブドメイン（例: stamp-maker.conect.llc）で使う場合**

   | タイプ | 名前（ホスト） | 値 |
   |--------|----------------|-----|
   | CNAME  | `stamp-maker`（または `www` など） | `ユーザー名.github.io` |

   **Squarespace で DNS を管理している場合**
   - **Settings** → **Domains**（または左上 **Domains**）→ **conect.llc** を選択
   - 左メニューまたはドメイン横の歯車から **DNS Settings**（または **DNS**）を開く
   - **Advanced Settings** または **Custom Records** の **Edit** / **Add** をクリック
   - **CNAME Records** の **+** で新規追加し、次のように入力：
     - **Host**（ホスト / 名前）: `stamp-maker` のみ（`.conect.llc` は不要。ドメインは自動で付与されます）
     - **Data**（値 / 参照先）: `あなたのGitHubユーザー名.github.io`（例: `yuki.github.io`）
   - **Save** で保存

3. **反映を待つ**
   - DNS の反映に数分〜最大 48 時間かかることがあります
   - GitHub の Custom domain 欄に緑のチェックが出れば利用可能です

4. **「The custom domain is already taken」と表示される場合**
   - conect.llc が別の GitHub ユーザー/リポジトリで使われている状態です。**あなたがドメインの所有者なら**、アカウントで「検証」するとドメインが解放され、このリポジトリで使えるようになります。
   - **手順（プロフィール設定で検証）:**
     1. GitHub 右上の**プロフィール画像** → **Settings**（リポジトリの Settings ではない）
     2. 左メニュー **Code, planning, and automation** → **Pages**
     3. 右側の **Add a domain** をクリック
     4. **conect.llc** を入力して **Add domain**
     5. 表示される **Add a DNS TXT record** の指示に従い、conect.llc の DNS 管理画面で TXT レコードを追加
        - 名前: `_github-pages-challenge-あなたのユーザー名`（GitHub に表示される値を使う）
        - 値: GitHub に表示される長い文字列
     6. DNS 反映後（数分〜24時間）、GitHub の Pages 設定で **Verify** をクリック
     7. 検証が成功したら、**このリポジトリ**の Settings → Pages → Custom domain に再度 `conect.llc` を入力して Save
   - 参考: [GitHub Docs - Verifying your custom domain](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)

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
