# Release Guide

## 自動リリース（release-please + GitHub Actions）

このプロジェクトは [release-please](https://github.com/googleapis/release-please) を使用して、**Conventional Commits** に基づいて自動的にバージョン管理、CHANGELOG生成、リリースを行います。

### リリース手順（推奨）

1. **Conventional Commits形式でコミット**
   ```bash
   # 新機能
   git commit -m "feat: Add new dashboard widget"

   # バグ修正
   git commit -m "fix: Resolve polling interval issue"

   # Breaking Change（メジャーバージョンアップ）
   git commit -m "feat!: Redesign API structure"
   # または
   git commit -m "feat: Change config format

   BREAKING CHANGE: Config file structure has changed"
   ```

   **Conventional Commitsのタイプ:**
   - `feat:` - 新機能（minorバージョンアップ）
   - `fix:` - バグ修正（patchバージョンアップ）
   - `feat!:` / `BREAKING CHANGE:` - 破壊的変更（majorバージョンアップ）
   - `docs:` - ドキュメント更新
   - `refactor:` - リファクタリング
   - `perf:` - パフォーマンス改善
   - `test:` - テスト追加
   - `chore:` - その他の変更

2. **mainブランチにpush**
   ```bash
   git push origin main
   ```

3. **release-pleaseが自動でPRを作成**
   - GitHub Actionsが自動的にrelease PRを作成します
   - PRには以下が含まれます：
     - `package.json`のバージョン更新
     - `CHANGELOG.md`の自動生成
     - リリースタグ

4. **Release PRをマージ**
   - PRをレビュー・承認してマージ
   - マージすると自動的に：
     - GitHub Releaseが作成される
     - macOSアプリ（.dmg, .zip）がビルドされる
     - リリースに成果物がアップロードされる

5. **リリースを確認**
   - https://github.com/hiragram/vibe-monitor/releases で確認

### 手動リリース（従来の方法）

release-pleaseを使わない場合：

1. **バージョン番号を更新**
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   npm version minor  # 0.1.0 -> 0.2.0
   npm version major  # 0.1.0 -> 1.0.0
   ```

2. **タグをpush**
   ```bash
   git push origin main --tags
   ```

### 生成されるファイル

- `Vibe Monitor-{version}-universal.dmg` - macOSインストーラー
- `Vibe Monitor-{version}-universal-mac.zip` - macOSアプリ（zip圧縮）

## ローカルビルド

GitHub Actionsを使わず、手元でビルドする場合：

```bash
# Next.jsアプリをビルド
ELECTRON_BUILD=true npm run build

# Electronアプリをビルド
npm run electron:build:mac
```

ビルド成果物は `dist/` ディレクトリに生成されます。

## コード署名について（オプション）

現在の設定は**署名なし**でビルドします。macOSで配布する際、ユーザーは初回起動時に「システム設定 > プライバシーとセキュリティ」から許可する必要があります。

### Apple Developer証明書で署名する場合

1. **Apple Developer Programに登録**（年間99ドル）
   - https://developer.apple.com/programs/

2. **証明書を作成**
   - "Developer ID Application"証明書を取得

3. **GitHub Secretsに証明書情報を追加**
   - `CSC_LINK`: 証明書ファイル（base64エンコード）
   - `CSC_KEY_PASSWORD`: 証明書のパスワード
   - `APPLE_ID`: Apple ID
   - `APPLE_APP_SPECIFIC_PASSWORD`: App固有パスワード

4. **GitHub Actionsワークフローを更新**
   `.github/workflows/release-please.yml`の`build-and-upload`ジョブに以下を追加：
   ```yaml
   env:
     CSC_LINK: ${{ secrets.CSC_LINK }}
     CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
     APPLE_ID: ${{ secrets.APPLE_ID }}
     APPLE_APP_SPECIFIC_PASSWORD: ${{ secrets.APPLE_APP_SPECIFIC_PASSWORD }}
   ```

署名とNotarization（公証）を行うと、ユーザーはダウンロード後すぐにアプリを起動できます。

## トラブルシューティング

### ビルドが失敗する場合

1. `out/` ディレクトリが生成されているか確認
2. `node_modules` を削除して再インストール
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### GitHub Actionsが失敗する場合

- Actionsタブでログを確認
- `GITHUB_TOKEN`の権限を確認（Settings > Actions > General > Workflow permissions）
