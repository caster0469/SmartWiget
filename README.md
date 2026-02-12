# SmartWiget

iPhoneウィジェット風のサイドパネルをPCで再現するクロスOSアプリです。

## この段階でできること（MVP）

- アプリ起動時に、画面右側へ「幅25%」のサイドパネルを表示
- パネルはフレームなし（`frame: false`）かつリサイズ不可（`resizable: false`）
- パネル内容は黒背景に `SmartWiget Panel` と表示される最小実装

> UI（時計/TODO/設定/保存/トレイ/ショートカット）はまだ未実装です。

## 開発起動方法

```bash
npm install
npm run dev
```

対応OS: Windows / macOS / Linux（Arch含む）