# RED ROACH (RR) Web Brand Specification

**Project:** RED ROACH Luxury Brand Site
**Role:** Specification Document
**Version:** 1.0.0
**Author:** Creative Director & Technical Architect

---

## 1. Architecture Design

本プロジェクトは、**「圧倒的なブランド表現（フロントエンド）」**と**「堅牢な決済基盤（STORES）」**を分離・共存させる**ハイブリッドアーキテクチャ**を採用します。

### System Flow
```mermaid
graph TD
    User[富裕層/ハイエンドユーザー] -->|Visit| Frontend[完全自作フロントエンド (Vercel/GitHub Pages)]
    Frontend -->|Unboxing Experience| Animation[スクロール連動アニメーション/WebGL]
    Frontend -->|Select Product| ProductUI[タイル選択式UI (S/M/L x Qty)]
    ProductUI -->|Click 'Subscribe'| Redirect[STORESへ遷移]
    
    subgraph STORES Platform
        Redirect --> Checkout[STORES 決済画面]
        Checkout -->|Payment| PaymentGate[決済処理]
        Checkout -->|Customer Data| CRM[顧客管理]
    end

    subgraph Operations
        CRM --> Shipping[梱包・発送 (プレミアム配送)]
    end
```

### Technical Stack
*   **Frontend**: HTML5, CSS3 (Modern CSS variables, Flexbox/Grid), JavaScript (ES6+, Vanilla for performance).
    *   *Rationale*: NO templates. Full control over timing, dissatisfaction-free rendering, and micro-interactions.
*   **Hosting**: Serverless (Vercel recommended for speed/global CDN).
*   **Backend/Commerce**: STORES.
    *   *Integration*: Direct link query parameters or simple anchor links to specific product checkout pages.

---

## 2. Design System

ブランドの核となる「Maison Margiela」的ミニマリズムと「Apple」的機能美を定義します。

### Color Palette
*   **Primary Background**: `#FFFFFF` (Pure White) - 徹底した清潔感、ラボの空気感。
*   **Text / Accent**: `#1A1A1A` (Almost Black) - 視認性と重厚感。完全な黒(#000)は避け、目に優しい高級感を。
*   **Brand Color**: `#800020` (Burgundy) - `logo.png`に基づく。アクセント、重要箇所のみに極小面積で使用。
*   **Error/Warning**: **使用禁止** (赤 `#FF0000` や 黄 `#FFFF00` は安っぽくなるため不可)。
    *   *Alternative*: グレーの階調表現や透過度でステータスを表現。

### Typography
*   **Font Family (JP)**: `Noto Serif JP`, `YuMincho`, `Hiragino Mincho ProN` - 明朝体ベースで知性と品格を。
*   **Font Family (EN)**: `Didot`, `Bodoni`, or `Helvetica Neue` (Light weight) - ファッショナブルかつモダンに。
*   **Rules**:
    *   Kerning (Letter-spacing)は広め (`0.05em` ~ `0.1em`) に設定し、ゆとりを持たせる。
    *   Line-heightは `1.8` 以上確保し、可読性と「間」を重視する。

### Spacing & Layout
*   **Whitespace**: 余白は「無駄」ではなく「ラグジュアリー」。コンテンツ密度の高いECサイトの対極を目指す。
*   **Grid**: 厳格なグリッドシステムを敷きつつ、要素を意図的にズラすことで「崩しの美学」を演出してもよい。

---

## 3. Page Structure & UX

### User Journey
サイト全体がひとつの「映像作品」のような体験を提供します。

#### 1. TOP Page (The Entrance)
*   **Hero Section**:
    *   画面中央に `logo.png` のみが静かにフェードイン。
    *   背景は白。ノイズやパーティクルが極めて微細に動く程度のOrganicな演出。
    *   キャッチコピー: 「VITAL SOURCE.」 (至高の栄養源)
*   **Narrative Scroll**:
    *   スクロールに合わせて、抽象的な美しいマクロ撮影写真（爬虫類の瞳、美しい羽のディテールなど）がParallaxで流れる。
    *   *Note*: ゴキブリの全体像は決して見せない。

#### 2. Products (The Selection)
*   **UI Concept**: Apple Storeの購入フローをよりミニマルに昇華。
*   **Layout**:
    *   ステップ1: **Size** (S / M / L) - 美しいタイポグラフィのタイルをクリック。
    *   ステップ2: **Quantity** (100 / 200 / 300) - サイズ選択後にフェードイン。
*   **Interaction**:
    *   ホバー時にふわりと浮き上がるシャドウ (`box-shadow`).
    *   選択状態はバーガンディの細いボーダーで表現。

#### 3. Quality (The Philosophy)
*   **Content**:
    *   **Lab Environment**: 「保管庫」ではなく「ラボ」。ステンレスとガラスの無機質な美しさ。
    *   **Diet**: 「餌」ではなく「食材」。人間用有機野菜、高級プロテインの使用を明記。
    *   **Price Justification**: 1匹35円の理由は、その圧倒的な生存率と栄養価、そして「不快感ゼロ」の体験にあることを説く。

#### 4. Subscription / Checkout Logic
*   **Action**: 商品選択後の「Subscribe」ボタン。
*   **Behavior**:
    *   クリック時の波紋エフェクト (Ripple Effect)。
    *   画面が白にフェードアウトし、シームレスにSTORES決済画面へ遷移。
    *   *Technical*: `window.location.href = 'https://stores.jp/bucket/checkout/...'`

#### 5. Live Lab Monitor (New)
*   **Purpose**: 「徹底された管理体制」の可視化。リアルタイムデータの公開。
*   **UI**:
    *   SF映画のコックピットやApple Fitnessのような「リング状ゲージ」。
    *   Lot A, Lot B, Lot C の3区画の温湿度を表示。
    *   Loading時は "Measuring..." アニメーション。
*   **Tech**:
    *   SwitchBot Open API (v1.1) を使用。
    *   Fetch APIによる非同期取得。

---

## 4. Copywriting Rules (Brand Voice)

「虫を売る店」ではなく「ハイジュエラー」「高級コスメブランド」の言葉選びを徹底します。

| 禁止ワード (Banned) | 推奨ワード (Recommended) | ニュアンス・意図 |
| :--- | :--- | :--- |
| **餌 (Bait/Food)** | **Vital Source / Nutrient / マテリアル** | 生命の根源、素材としての価値 |
| **ゴキブリ / 虫** | **RED ROACH / The Species / 生命体** | 嫌悪感の排除、学術的・高貴な響き |
| **死着** | **Loss / ロス** | 生々しさを消す |
| **繁殖 / 養殖** | **Cultivation / Architecture** | 工業的・建築的な厳密管理を示唆 |
| **購入する / 買う** | **Acquire / Subscribe / Accept** | 「手に入れる」「受け入れる」体験 |
| **安い / お得** | **(言及しない) / Value / Smart** | 価格競争の概念を持たない |
| **段ボール / 梱包** | **Package / Unboxing Experience** | 開封体験そのものを商品とする |
| **注意 / 警告** | **Note / Guide / Etiquette** | ユーザーを「客」ではなく「ゲスト」として扱う |

---

*End of Specification*
