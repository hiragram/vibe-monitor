# Vibe Monitor

GitHub リポジトリのアクティビティをリアルタイムで監視するElectronアプリケーションです。

## 特徴

- **リアルタイム監視**: Pull Request、Workflow Run、Runnerの状態を自動更新
- **ポーリング制御**: 更新間隔の調整や一時停止が可能
- **Rate Limit対策**: APIリクエストを最適化し、GitHub API rate limitに配慮
- **ダークモード対応**: ライト/ダークテーマの切り替え
- **Electronアプリ**: デスクトップアプリケーションとして動作

## セットアップ

### 必要なもの

- Node.js 18以上
- npm または yarn
- GitHub Personal Access Token

### インストール

```bash
# 依存関係のインストール
npm install
```

### GitHub Personal Access Token の取得

1. [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens/new) にアクセス
2. 以下のスコープを付与:
   - `repo` (リポジトリへのフルアクセス)
   - `workflow` (GitHub Actionsへのアクセス)
3. トークンを生成してコピー

## 使い方

### 開発モード（Electronアプリ）

```bash
npm run electron:dev
```

このコマンドで以下が実行されます:
- Next.js開発サーバーの起動 (localhost:3000)
- Electronアプリの起動

### Webブラウザで開発

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### 本番ビルド（Electronアプリ）

```bash
# macOS用のビルド
npm run electron:build:mac

# または汎用ビルド
npm run electron:build
```

ビルドされたアプリは `dist/` ディレクトリに生成されます。

## 設定

アプリを起動すると、以下の情報を入力する画面が表示されます:

1. **Repository Owner**: GitHubのユーザー名または組織名
2. **Repository Name**: 監視したいリポジトリ名
3. **GitHub Token**: 取得したPersonal Access Token

## 機能

### ポーリング制御

右上のドロップダウンから更新間隔を変更できます:
- **Disabled**: ポーリングを停止（手動更新のみ）
- **10s**: 10秒ごとに更新
- **30s**: 30秒ごとに更新（デフォルト）
- **1m**: 1分ごとに更新

### エラーハンドリング

- GitHub APIからエラーが返された場合、自動的にポーリングが停止されます
- エラーメッセージでrate limitなどの問題を確認できます
- ポーリングを再開するには、ドロップダウンから間隔を選択してください

### API Rate Limit

GitHub APIのrate limitは以下の通りです:
- Personal Access Token: **5,000リクエスト/時**

このアプリは1回のポーリングで約12-15リクエストを使用します:
- 30秒間隔: 約1,800リクエスト/時（36%使用）
- 10秒間隔: 約5,400リクエスト/時（**rate limit超過の可能性あり**）

推奨設定: **30秒以上の間隔**

## 技術スタック

- **Next.js 15**: Reactフレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **Electron**: デスクトップアプリケーション
- **GitHub REST API**: データ取得

## プロジェクト構成

```
vibe-monitor/
├── app/                    # Next.jsのAppルーター
├── components/             # Reactコンポーネント
├── lib/                    # GitHub APIクライアント
├── types/                  # TypeScript型定義
├── electron/               # Electronメインプロセス
│   └── main.js
└── public/                 # 静的ファイル
```

## トラブルシューティング

### Rate Limitエラー

エラーメッセージ: `Failed to fetch data (403)`

**対処法**:
1. ポーリング間隔を長くする（1分など）
2. 一時的にポーリングを無効化
3. 1時間待ってrate limitがリセットされるのを待つ

### Electronアプリが起動しない

**対処法**:
1. Next.jsサーバーが起動しているか確認
2. ポート3000が使用可能か確認
3. `npm run electron:dev` を再実行

### データが表示されない

**対処法**:
1. GitHub Tokenが正しいか確認
2. Tokenに必要なスコープ（`repo`, `workflow`）が付与されているか確認
3. リポジトリ名とオーナー名が正しいか確認

## ライセンス

MIT

## 貢献

Issue、Pull Requestを歓迎します！
