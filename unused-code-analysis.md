# 未使用コード調査レポート

## 調査対象
Backlog Raycast拡張機能のプロジェクトにおける未使用のファイル、メソッド、コンポーネントの分析

## 調査結果

### 🔴 未使用ファイル

#### 1. `src/components/Providers.tsx`
- **理由**: このファイルは`Providers`コンポーネントを定義しているが、実際には使用されていない
- **詳細**: `src/utils/providers.tsx`内に別の`Providers`コンポーネントが定義されており、`withProviders`HOCを通じてそちらが使用されている
- **削除推奨**: ✅ 削除可能

### 🔴 未使用メソッド

#### 1. `getUnreadCounts` 関数 (`src/utils/unread.ts`)
- **理由**: exportされているが、どこからもimportされず使用されていない
- **詳細**: 
  - 各スペースの未読通知数を取得する関数
  - 似た機能が`src/unread-count.tsx`で直接実装されている
  - 重複した実装となっている
- **削除推奨**: ✅ 削除可能

### 🟢 使用されているファイル・メソッド

#### メインコマンドファイル
- `src/notifications.tsx` - 通知コマンド
- `src/recent-viewed.tsx` - 最近閲覧したアイテムコマンド  
- `src/unread-count.tsx` - 未読カウントメニューバーコマンド

#### コンポーネント（全て使用中）
- `src/components/CommonActionPanel.tsx` - 共通アクションパネル
- `src/components/CredentialsProvider.tsx` - 認証情報プロバイダー
- `src/components/IssueDetail.tsx` - 課題詳細表示
- `src/components/IssueItem.tsx` - 課題アイテム表示
- `src/components/NotificationItem.tsx` - 通知アイテム表示
- `src/components/ProjectItem.tsx` - プロジェクトアイテム表示
- `src/components/SearchBarAccessory.tsx` - 検索バーアクセサリー
- `src/components/SpaceForm.tsx` - スペース設定フォーム
- `src/components/WikiItem.tsx` - Wikiアイテム表示

#### カスタムフック（全て使用中）
- `src/hooks/useCredentials.ts` - 認証情報管理
- `src/hooks/useCurrentSpace.ts` - 現在のスペース管理
- `src/hooks/useProject.ts` - プロジェクト情報取得
- `src/hooks/useSpaces.ts` - スペース一覧取得

#### ユーティリティ関数（`getUnreadCounts`以外は全て使用中）
- `src/utils/cache.ts` - キャッシュ管理
- `src/utils/credentials.ts` - 認証情報スキーマ
- `src/utils/image.ts` - 画像URL生成
- `src/utils/promise-dedupe.ts` - Promise重複排除
- `src/utils/providers.tsx` - プロバイダーHOC
- `src/utils/space.ts` - スペース関連ユーティリティ

## 推奨アクション

### 即座に削除可能なもの
1. **`src/components/Providers.tsx`** - 完全に未使用
2. **`getUnreadCounts`関数** - `src/utils/unread.ts`から削除、またはファイル全体を削除

### 削除による影響
- 削除しても機能に影響なし
- コードベースの簡潔性向上
- 保守性の向上

## 注意点
- `src/utils/unread.ts`ファイル全体が`getUnreadCounts`関数のみを含んでいるため、関数削除と同時にファイル自体も削除可能
- 削除前に最終確認として、プロジェクト全体での動作テストを推奨

## 統計
- **総ファイル数**: 約25ファイル
- **未使用ファイル**: 1ファイル
- **未使用メソッド**: 1メソッド
- **使用率**: 96%（非常に良好）