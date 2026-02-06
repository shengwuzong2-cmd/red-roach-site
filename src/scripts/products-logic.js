/**
 * 製品ページのロジック V3.7
 * - 給餌計算機能(日本語化・選択式UI対応)
 * - モジュール化対応
 */

import { UNIFIED_PRICE_DATA } from './product-data.js';

// =========================================================================
// 1. 価格・計算用データ
// =========================================================================
// =========================================================================
// 0. 定数・設定データ
// =========================================================================

// 季節ごとの代謝補正係数
const SEASON_MULTIPLIER = { spring: 1.10, summer: 1.30, autumn: 1.05, winter: 0.90 };

// Optimizer計算用 単価 (概算)
const PRICE_PER_INSECT = { SS: 26.4, S: 29.5, M: 31.6, L: 34.8 };

// 解析ログメッセージ
const SYSTEM_LOGS = ["個体データを分析中...", "成長段階に基づいた代謝計算を実行...", "環境温度による補正を適用...", "最適なプランを特定しました。"];



// =========================================================================
// 1. 代謝プロファイル & 生物データベース
// =========================================================================

/**
 * ========================================
 * 代謝プロファイル (Metabolic Profiles)
 * ========================================
 * 生物の活動レベルと食性に基づく消費係数。
 * base: 月間基本給餌数 (標準個体換算)
 * size: 推奨サイズ (SS/S/M/L)
 * 
 * 【2026-01-21更新】180+学術・飼育ソースに基づく修正版
 */
const METABOLIC_PROFILES = {
    // P1: 高代謝・活動的 (大型トカゲ、アロワナ幼魚、猛禽類)
    // 根拠: サバンナモニター・フトアゴヒゲトカゲ 65ソース
    // 主な修正: 成体期の肥満予防のため-75%削減
    HIGH_ACTIVE: {
        hatchling: { base: 500, size: "S" },   // 900→500 (-44%)
        juvenile: { base: 300, size: "M" },    // 600→300 (-50%)
        subadult: { base: 150, size: "L" },    // 450→150 (-67%)
        adult: { base: 75, size: "L" }         // 300→75 (-75%)
    },
    // P2: 中代謝・標準 (レオパ、ニシアフ、一般地生ヤモリ)
    // 根拠: レオパードゲッコー 40ソース
    // 主な修正: 幼体期削減、成体期微増
    MODERATE: {
        hatchling: { base: 200, size: "SS" },  // 450→200 (-56%)
        juvenile: { base: 250, size: "S" },    // 300→250 (-17%)
        subadult: { base: 120, size: "M" },    // 150→120 (-20%)
        adult: { base: 70, size: "M" }         // 60→70 (+17%)
    },
    // P3: 低代謝・待ち伏せ型 (ツノガエル、タマオヤモリ、ボールパイソン等の昆虫食)
    // 根拠: ツノガエル 40ソース
    // 主な修正: 成体期+50%（過小評価の修正）
    LOW_PASSIVE: {
        hatchling: { base: 90, size: "SS" },   // 150→90 (-40%)
        juvenile: { base: 75, size: "S" },     // 90→75 (-17%)
        subadult: { base: 40, size: "M" },     // 45→40 (-11%)
        adult: { base: 30, size: "L" }         // 20→30 (+50%)
    },
    // P4: 樹上性・雑食傾向 (クレス、ガーゴイル)
    // 根拠: クレステッドゲッコー 40ソース
    // 主な修正: 人工飼料併用を考慮し全段階で削減
    ARBOREAL_OMNI: {
        hatchling: { base: 120, size: "SS" },  // 300→120 (-60%)
        juvenile: { base: 60, size: "S" },     // 150→60 (-60%)
        subadult: { base: 30, size: "M" },     // 100→30 (-70%)
        adult: { base: 20, size: "L" }         // 40→20 (-50%)
    },
    // P5: 変温・節足動物 (タランチュラ、サソリ)
    // 根拠: タランチュラ 40ソース
    // 主な修正: 超低代謝を反映し大幅削減
    INSECT_ECTO: {
        hatchling: { base: 12, size: "SS" },   // 60→12 (-80%)
        juvenile: { base: 8, size: "S" },      // 30→8 (-73%)
        subadult: { base: 4, size: "M" },      // 15→4 (-73%)
        adult: { base: 3, size: "L" }          // 8→3 (-62%)
    },
    // P6: 活動的・捕食性昆虫 (カマキリ、ムカデ)
    // 根拠: カマキリ 40ソース
    // 主な修正: 絶食耐性を考慮し全段階で削減
    INSECT_ACTIVE: {
        hatchling: { base: 60, size: "SS" },   // 120→60 (-50%)
        juvenile: { base: 40, size: "S" },     // 90→40 (-56%)
        subadult: { base: 20, size: "M" },     // 60→20 (-67%)
        adult: { base: 15, size: "L" }         // 30→15 (-50%)
    },
    // P7: 哺乳類・副食 (ハリネズミ、モモンガ)
    // 根拠: ハリネズミ 40ソース
    // 主な修正: なし（現行値が妥当と確認）
    MAMMAL_TREAT: {
        hatchling: { base: 150, size: "SS" },  // 維持
        juvenile: { base: 100, size: "S" },    // 維持
        subadult: { base: 60, size: "M" },     // 維持
        adult: { base: 30, size: "M" }         // 維持
    },
    // P8: 超大型・爆食 (アロワナ成魚、大型モニター)
    // 根拠: テグー 40ソース
    // 主な修正: 全段階で微調整
    MEGA_EATER: {
        hatchling: { base: 1000, size: "M" },  // 1200→1000 (-17%)
        juvenile: { base: 800, size: "L" },    // 900→800 (-11%)
        subadult: { base: 450, size: "L" },    // 600→450 (-25%)
        adult: { base: 400, size: "L" }        // 450→400 (-11%)
    }
};

/**
 * 生物種設定 (Species Configuration)
 */
/**
 * 生物種設定 (Species Configuration)
 * 各生物種を代謝プロファイルに紐付け、固有のTipsを定義。
 * Tipsは獣医(Vet)、研究者(Researcher)、熟練飼育者(Breeder)の知見を統合。
 */
const SPECIES_CONFIG = {
    // 1. LIZARD (Advanced/Rare)
    lizard_sungazer: { profile: "LOW_PASSIVE", tips: "オオヨロイトカゲは代謝が低めですが、脱皮前は水分摂取を重視してください。霧吹きで反応させて給餌を。" },
    lizard_armadillo: { profile: "MODERATE", tips: "アルマジロトカゲは群れでの社会性があります。競合を避けるため、各個体にピンセットで行き渡らせるのが確実です。" },
    iguana_banana: { profile: "MODERATE", tips: "バナナスパイニー等は雑食です。幼体期は昆虫比率高めで、成体になるにつれ野菜中心へシフトしてください。" },
    agame_bearded: { profile: "HIGH_ACTIVE", tips: "フトアゴヒゲトカゲは雑食性で活発です。幼体期は昆虫中心、成体は野菜も多く与えてください。カルシウムとビタミンD3の添加が必須です。" },
    tegu: { profile: "MEGA_EATER", tips: "テグーは非常に大食漢です。肥満に注意し、運動できる広いスペースを確保してください。" },
    tegu_red: { profile: "MEGA_EATER", tips: "レッドテグーは果実も好みます。昆虫にはカルシウムだけでなくビタミン類も添加し、バランスを整えてください。" },
    tegu_bw: { profile: "MEGA_EATER", tips: "B&Wテグーは貪欲です。肥満防止のため、腹八分目を心がけ、運動量を確保できる環境が必須です。" },
    monitor_savannah: { profile: "HIGH_ACTIVE", tips: "サバンナモニターの肥満は短命の主因です。シェルターに引きこもりがちなら給餌間隔を空け、運動を促してください。" },
    monitor_ridge: { profile: "HIGH_ACTIVE", tips: "リッジテールはドワーフモニターの中でも活発です。追いかけさせて捕食スイッチを入れるのがコツです。" },

    // 2. GECKO (Knob-tail/Rare)
    gecko_knobtail: { profile: "LOW_PASSIVE", tips: "タマオヤモリは待ち伏せ型です。目の前で小刻みに揺らすと反応します。過度な給餌は消化不良の元です。" },
    knob_rough: { profile: "LOW_PASSIVE", tips: "オニタマは待ち伏せ型です。目の前で小刻みに揺らすと反応します。過度な給餌は消化不良の元です。" },
    knob_smooth: { profile: "MODERATE", tips: "ナメハダは皮膚が薄いため、置き餌で虫に齧られないよう注意。ピンセット給餌が安全です。" },
    knob_dereni: { profile: "LOW_PASSIVE", tips: "デレニは神経質な面があります。シェルターの入り口付近にそっと置くスタイルが好まれます。" },
    knob_banded: { profile: "MODERATE", tips: "オビタマは比較的貪欲です。尾の太さを目安に、痩せすぎないよう定期的に給餌を。" },
    knob_pilbara: { profile: "HIGH_ACTIVE", tips: "ピルバラは岩場を素早く動きます。生き餌を放してハンティングさせると良いエンリッチメントになります。" },

    // 3. GECKO (Terrestrial/Small)
    gecko_leopard: { profile: "MODERATE", tips: "レオパは脇プニが出たらダイエットのサイン。発情期の拒食は焦らず、体重減少が著しくなければ様子見を。" },
    gecko_fattail: { profile: "MODERATE", tips: "ニシアフはレオパより湿度依存度が高いです。脱皮不全を防ぐため、ウェットシェルター内での給餌も有効。" },
    gecko_picta: { profile: "MODERATE", tips: "ソメワケは繁殖力が強く、産卵期のメスは大量のカルシウムを消費します。毎回添加してください。" },
    gecko_viper: { profile: "LOW_PASSIVE", tips: "マツカサヤモリは尾に栄養を貯めます。ここが萎んでいなければ、数日の絶食は問題ありません。" },
    gecko_helmet: { profile: "LOW_PASSIVE", tips: "ヘルメットゲッコーは砂漠性。水分過多なコオロギより、レッドローチの方が消化に適しています。" },
    gecko_milii: { profile: "MODERATE", tips: "アンダーウッディは夜行性で視覚が鋭いです。暗くしてからの給餌が最も反応が良いでしょう。" },
    gecko_micro: { profile: "MODERATE", tips: "小型種（ミクロゲッコー）は代謝が早いです。SSサイズをこまめに与え、脱水を防いでください。" },

    // 4. GECKO (Arboreal/Others)
    gecko_crested: { profile: "ARBOREAL_OMNI", tips: "クレスは人工飼料メインでも育ちますが、週1回の昆虫給餌は成長促進と野生本能の維持に役立ちます。" },
    gecko_gargoyle: { profile: "ARBOREAL_OMNI", tips: "ガーゴイルはクレスより肉食傾向が強めです。カルシウム不足になりやすいため、D3添加を忘れずに。" },
    gecko_tokay: { profile: "HIGH_ACTIVE", tips: "トッケイは顎が強力です。大きめのローチでもバリバリ食べますが、口内を傷つけないよう注意。" },
    gecko_leachie: { profile: "ARBOREAL_OMNI", tips: "ジャイアントゲッコーは大型で力強いです。人工飼料と昆虫のバランスを取り、カルシウム添加を忘れずに。" },
    gecko_day: { profile: "ARBOREAL_OMNI", tips: "ヒルヤモリは昼行性でUVB要求量が高いです。カルシウムの代謝には紫外線が不可欠です。" },
    gecko_flying: { profile: "ARBOREAL_OMNI", tips: "クチサケヤモリは樹皮に擬態します。壁面に這わせるように虫を動かすと捕食行動を誘発できます。" },
    gecko_stumpff: { profile: "MODERATE", tips: "シュトゥンプフは動きが素早いです。脱走に注意しながら、小さめのケースで確実に給餌してください。" },

    // 5. OTHERS (Lizard/Snake)
    lizard_kanahebi: { profile: "INSECT_ACTIVE", tips: "カナヘビ類は運動量が多く代謝が高いです。毎日〜1日おきに、口に入る最大サイズを与えてください。" },
    skink_blue: { profile: "MODERATE", tips: "アオジタは雑食の王様です。昆虫は全体の3-4割にし、野菜や果物、フードを混ぜて栄養バランスを。" },
    skink_pink: { profile: "MODERATE", tips: "モモジタはカタツムリ専食傾向がありますが、レッドローチの中身を出して匂いをつければ食べることも。" },
    skink_fire: { profile: "MODERATE", tips: "フェルナンデススキンクは活発です。昆虫と野菜のバランスを取り、カルシウム添加を忘れずに。" },
    skink_shingle: { profile: "LOW_PASSIVE", tips: "マツカサトカゲは植物質も好みます。肥満は内臓疾患直結です。給餌間隔は長めに。" },
    skink_schneider: { profile: "HIGH_ACTIVE", tips: "シュナイダーは活発に走り回ります。生き餌を追いかけさせることが健康維持の秘訣です。" },
    skink_sandfish: { profile: "LOW_PASSIVE", tips: "サンドフィッシュは砂中の振動を感じ取ります。砂の上に放つと、潜りながら捕食する姿が見られます。" },
    lizard_worm: { profile: "LOW_PASSIVE", tips: "ミミズトカゲは地中性です。床材の中に潜って給餌するか、暗い環境で置き餌をしてください。" },
    snake_baby: { profile: "LOW_PASSIVE", tips: "幼体ヘビの強制給餌やアシストに。ピンクマウスに昆虫の体液を塗ると食いつく場合があります。" },
    snake_asian: { profile: "LOW_PASSIVE", tips: "カマゲリヘビ等のカタツムリ食の種でも、脱皮直後の柔らかいローチなら食べる個体もいます。" },

    // 6. AMPHIBIAN
    frog_pacman: { profile: "LOW_PASSIVE", tips: "ツノガエルは「満腹」を知りません。与えすぎは突然死の原因です。排泄リズムを最優先の指標に。" },
    frog_pixie: { profile: "LOW_PASSIVE", tips: "ピクシーフロッグは大型で貪欲です。肥満に注意し、適切な給餌間隔を守ってください。" },
    frog_tree: { profile: "MODERATE", tips: "アマガエルは樹上性です。動く餌に反応しやすいので、ピンセットで揺らして与えてください。" },
    frog_toad: { profile: "MODERATE", tips: "ヒキガエルは動くものへの反応が良いです。舌での捕獲失敗が続くようなら、ピンセットで補助を。" },
    frog_dart: { profile: "INSECT_ACTIVE", tips: "ヤドクガエルにはSSサイズが必須。キイロショウジョウバエと併用し、栄養の偏りを防いでください。" },
    frog_rain: { profile: "LOW_PASSIVE", tips: "アメフリは地下性です。土の中から顔を出したタイミングで、目の前に落としてください。" },
    newt: { profile: "MODERATE", tips: "イモリは水中と陸上を行き来します。水質管理と湿度管理の両方が重要です。" },
    newt_fire: { profile: "MODERATE", tips: "イモリの上陸幼体は乾燥に弱く、餌付きにくい時期。極小ローチは生きた栄養カプセルとして優秀です。" },
    salamander: { profile: "LOW_PASSIVE", tips: "サンショウウオは低温を好みます。活発に動かない場合は、温度が高すぎる可能性があります。" },

    // 7. INSECT/ARTHROPOD
    insect_mantis: { profile: "INSECT_ACTIVE", tips: "カマキリは脱皮前絶食します。無理に与えず、脱皮後体が固まってから再開してください。" },
    mantis_general: { profile: "INSECT_ACTIVE", tips: "カマキリは脱皮前絶食します。無理に与えず、脱皮後体が固まってから再開してください。" },
    spider_tarantula: { profile: "INSECT_ECTO", tips: "タランチュラは驚異的な低燃費。腹部が縮んできてからで十分です。食べ残しはダニの原因になるので即撤去。" },
    spider_hunting: { profile: "INSECT_ACTIVE", tips: "アシダカグモはハンターです。広いケースに放てば、夜間に自ら捕食します。" },
    spider_web: { profile: "INSECT_ECTO", tips: "造網性は網にかかった獲物を認識します。巣にそっと引っ掛けるように与えてください。" },
    scorpion: { profile: "INSECT_ECTO", tips: "サソリは鋏で捕らえます。ハサミのサイズに合った獲物を選ばないと、逆に怖がって食べません。" },
    centipede: { profile: "INSECT_ACTIVE", tips: "ムカデは脱水に弱いため、水分をたっぷり摂らせたローチを与えるのが効果的です。" },
    insect_predatory: { profile: "INSECT_ACTIVE", tips: "ハンミョウやゴミムシは強力な顎を持ちます。硬い甲虫類よりローチの方が捕食コストが低く好まれます。" },
    insect_water: { profile: "INSECT_ACTIVE", tips: "タガメやゲンゴロウには、水面に浮かべるか、ピンセットで水中で揺らして与えてください。" },

    // 8. MAMMAL
    mammal_marmoset: { profile: "MAMMAL_TREAT", tips: "マーモセットにはタンパク質補給として。手渡しで与え、コミュニケーションの一環に。" },
    mammal_glider: { profile: "MAMMAL_TREAT", tips: "フクロモモンガは偏食しがち。昆虫の味を覚えさせると、ペレットの食いつきも良くなることがあります。" },
    mammal_hedgehog: { profile: "MAMMAL_TREAT", tips: "ハリネズミは肥満になりやすいです。ミルワームより低脂質なレッドローチは主食の補助として最適。" },
    mammal_meerkat: { profile: "HIGH_ACTIVE", tips: "ミーアキャットは土を掘るのが仕事。床材の中に隠して、探させるエンリッチメントを。" },

    // 9. BIRD
    bird_owl: { profile: "HIGH_ACTIVE", tips: "小型フクロウのペリット形成補助に。全部消化されにくいキチン質が良い働きをします。" },
    bird_ground: { profile: "HIGH_ACTIVE", tips: "ヒメウズラの産卵期には動物性タンパク質が不可欠。殻の質を高めるためにもカルシウム添加を。" },
    bird_insect: { profile: "HIGH_ACTIVE", tips: "モズなどの昆虫食鳥類の保護時、強制給餌に使いやすいサイズです。水分補給も兼ねられます。" },

    // 10. AQUATIC
    fish_arowana: { profile: "MEGA_EATER", tips: "アロワナの色揚げには、カロテノイドを含む餌を食べさせたローチを与える「ガットローディング」が有効。" },
    fish_predatory: { profile: "HIGH_ACTIVE", tips: "スネークヘッドは丸呑みします。喉に詰まらせないサイズを選び、飛び出し事故に注意してください。" },
    fish_mudskipper: { profile: "MODERATE", tips: "トビハゼは陸上で捕食します。水際で動くローチは彼らの捕食本能を強烈に刺激します。" },
    fish_archer: { profile: "MODERATE", tips: "テッポウウオの水鉄砲が見たいなら、水上の枝葉にローチを這わせてみてください。" },
    turtle_aquatic: { profile: "MODERATE", tips: "水棲ガメの配合飼料に飽きた時のアクセントに。水に浮くので食べ残しの回収も容易です。" },
    aquatic_crab: { profile: "MODERATE", tips: "カニやザリガニは脱皮直後のカルシウム補給として、ローチを殻ごとバリバリ食べます。" },
    aquatic_nautilus: { profile: "LOW_PASSIVE", tips: "オウムガイは夜行性で嗅覚で餌を探します。傷をつけて体液の匂いを水中に漂わせてみてください。" }
};


// =========================================================================
// 2. インタラクション関数
// =========================================================================

/**
 * チップ選択のトグル処理
 */
export function selectChip(button) {
    const container = button.closest('.opt-chip-container');
    if (!container) return;
    container.querySelectorAll('.opt-chip').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

/**
 * 特定の名前のチップコンテナから現在選択されている値を取得する
 */
function getChipValue(dataId) {
    const container = document.querySelector(`.opt-chip-container[data-id="${dataId}"]`);
    if (!container) return null;
    const activeChip = container.querySelector('.opt-chip.active');
    return activeChip ? activeChip.dataset.value : null;
}

// =========================================================================
// 3. 解析ロジック (チップ形式対応)
// =========================================================================

export function calculateFeed() {
    const btn = document.querySelector('.analyze-btn');
    const resultArea = document.getElementById('suggestionArea');
    if (!btn || !resultArea || btn.disabled) return;

    btn.disabled = true;
    resultArea.style.display = 'block';

    const logHTML = `<div id="processLog"></div>`;
    document.getElementById('resultDesc').innerHTML = logHTML;
    document.getElementById('resultTitle').innerText = "解析中...";

    let step = 0;
    const logInterval = setInterval(() => {
        const logBox = document.getElementById('processLog');
        if (logBox && step < SYSTEM_LOGS.length) {
            logBox.innerHTML += `> ${SYSTEM_LOGS[step]}<br>`;
            logBox.scrollTop = logBox.scrollHeight;
            step++;
        } else {
            clearInterval(logInterval);
            setTimeout(() => finalizeResult(btn), 500);
        }
    }, 150);
}

function finalizeResult(btn) {
    const speciesSelect = document.getElementById('speciesSelect');
    // 新UI(Select)と旧UI(Chip)の両対応
    const species = speciesSelect ? speciesSelect.value : getChipValue('speciesSelect');
    const size = getChipValue('sizeSelect');
    const individualCount = parseInt(document.getElementById('individualCount').value) || 1;
    const keepingTemp = parseInt(getChipValue('keepingTemp')) || 28;

    if (!species || !size) {
        alert("未選択の項目があります。");
        btn.disabled = false;
        return;
    }

    // 1. 設定の取得
    const config = SPECIES_CONFIG[species];
    if (!config) {
        console.error("Unknown Species:", species);
        btn.disabled = false;
        return;
    }

    // 2. プロファイルデータの取得
    const profile = METABOLIC_PROFILES[config.profile];
    const data = profile[size]; // size = hatchling, juvenile, etc.

    // 3. 補正係数の計算
    const month = new Date().getMonth() + 1;
    let currentSeason = (month >= 6 && month <= 8) ? "summer" : (month >= 9 && month <= 11 ? "autumn" : (month === 12 || month <= 2 ? "winter" : "spring"));
    const seasonRate = SEASON_MULTIPLIER[currentSeason];

    // 温度補正 (簡易版: 25度以下=low, 26-30=opt, 31以上=high)
    let tempRate = 1.0;
    if (keepingTemp < 25) tempRate = 0.8;
    else if (keepingTemp > 30) tempRate = 1.15;

    // 基本必要数の計算
    let baseCount = data.base * seasonRate * tempRate;

    // 4. 合計とプラン提案
    let exactCount = Math.round(baseCount * individualCount);
    // 推奨パッケージ（少し余裕を持たせる）
    let suggestQty;
    if (exactCount > 280) suggestQty = 300;
    else if (exactCount > 180) suggestQty = 200;
    else suggestQty = 100;

    const productTitle = `RED ROACH サイズ${data.size}`;
    const monthlyCost = Math.round(exactCount * PRICE_PER_INSECT[data.size]);

    const finalHTML = `
        <div style="text-align:left; line-height:1.6;">
            <p>推奨パッケージ: <strong style="color:var(--accent-blue);">${productTitle}</strong></p>
            <p>月間必要数: <strong style="color:var(--accent-blue); font-size:1.5rem;">${exactCount}</strong> 匹</p>
            <p style="font-size:0.8rem; color:#666;">概算コスト: ¥${monthlyCost.toLocaleString()} (@¥${PRICE_PER_INSECT[data.size]}/匹)</p>
            <div style="margin-top:12px; padding:12px; background:#F9FAFB; border-radius:6px; font-size:0.85rem;">
                <span style="font-weight:700; color:#333;">💡 獣医師のアドバイス:</span><br>
                ${config.tips}
            </div>
        </div>
    `;

    document.getElementById('resultTitle').innerText = `${suggestQty}匹セットをおすすめします`;
    document.getElementById('resultDesc').innerHTML = finalHTML;

    const buyBtn = document.getElementById('dynamicBuyBtn');
    if (buyBtn) {
        buyBtn.innerText = `[${data.size}サイズ / ${suggestQty}匹] を見る`;
        buyBtn.style.display = 'inline-block';
        buyBtn.onclick = function (e) {
            e.preventDefault();
            const targetCard = document.querySelector(`.product-card[data-size="${data.size}"]`);
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                targetCard.querySelector(`.qty-btn[data-qty="${suggestQty}"]`)?.click();
            }
        };
    }
    btn.disabled = false;
    document.getElementById('suggestionArea').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// =========================================================================
// 4. 初期化
// =========================================================================

export function initProductsPage() {
    console.log("Products Logic V3.7 (Modularized) Loaded.");

    // シミュレーター +/- ボタン
    document.querySelectorAll('.qty-adjust').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById('individualCount');
            const dir = parseInt(btn.dataset.dir);
            let val = parseInt(input.value) + dir;
            if (val < 1) val = 1;
            if (val > 50) val = 50;
            input.value = val;
        });
    });

    // シミュレーター チップ選択
    document.querySelectorAll('.opt-chip').forEach(btn => {
        btn.addEventListener('click', function () { selectChip(this); });
    });

    document.querySelector('.analyze-btn')?.addEventListener('click', calculateFeed);

    // グローバル関数として公開
    window.calculateFeed = calculateFeed;
    window.selectChip = selectChip;
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initProductsPage);
else initProductsPage();
