/**
 * Supported Target Species Data
 * Used for Suggestion/Autocomplete in Consultation and Optimizer
 */

export const SPECIES_DATA = {
    "reptiles": {
        label: "爬虫類（トカゲ・ヤモリ・ヘビ）",
        evidence: {
            summary: "豪州原産のタマオヤモリ属(*Nephrurus*)の野生下での胃内容物調査では、クモ、甲虫、シロアリ、そしてゴキブリ類が頻繁に確認されています。野生個体は、素早く動く節足動物を捕食することで運動量を確保しています。レッドローチ(*Shelfordella lateralis*)は、乾燥重量比50-70%の高タンパク質(成虫平均60%、Kulma et al., 2016)を含みながらも、成虫の脂肪分は14-27%(平均20%)と低く抑えられています。これは、飼育下で肥満になりやすい地上性ヤモリにとって、野生の獲物に近い「低脂質・高タンパク」な理想的な栄養バランスを提供します。",
            references: [
                { title: "Investigation of the nutritional value of common feeder insects (Oonincx & Dierenfeld, 2012)", url: "https://doi.org/10.1111/j.1439-0396.2011.01169.x" },
                { title: "Dietary ecology of Australian desert geckos (Pianka, 1986)", url: "#" }
            ]
        },
        groups: [
            {
                name: "高級トカゲ",
                items: [
                    "オオヨロイトカゲ",
                    "アルマジロトカゲ",
                    "バナナスパイニーテールイグアナ（イエローファントム等）",
                    "レッドテグー",
                    "ブラック＆ホワイトテグー",
                    "サバンナモニター",
                    "リッジテールモニター"
                ]
            },
            {
                name: "タマオヤモリ（高級・希少種）",
                items: [
                    "オニタマオヤモリ（ノーマル・各モルフ）",
                    "ナメハダタマオヤモリ（レビスタマオ）",
                    "デレニタマオヤモリ",
                    "オビタマオヤモリ",
                    "ピルバラタマオヤモリ"
                ]
            },
            {
                name: "地上性・小型ヤモリ",
                items: [
                    "ヒョウモントカゲモドキ",
                    "ニシアフリカトカゲモドキ",
                    "ソメワケササクレヤモリ",
                    "マツカサヤモリ",
                    "ヘルメットゲッコー",
                    "アンダーウッディサウルス（ミリィヤモリ）",
                    "ミクロゲッコー（ペトリボウユビヤモリ等）"
                ]
            },
            {
                name: "樹上性・その他ヤモリ",
                items: [
                    "クレステッドゲッコー",
                    "ガーゴイルゲッコー",
                    "トッケイヤモリ",
                    "ヒルヤモリ",
                    "クチサケヤモリ",
                    "シュトゥンプフササクレヤモリ"
                ]
            },
            {
                name: "その他のトカゲ・ヘビ",
                items: [
                    "ニホンカナヘビ",
                    "アオカナヘビ",
                    "ミドリカナヘビ",
                    "ニワカナヘビ",
                    "アオジタトカゲ",
                    "モモジタトカゲ",
                    "マツカサトカゲ",
                    "シュナイダースキンク",
                    "サンドフィッシュトカゲ",
                    "ミミズトカゲ",
                    "アンゴラパイソン（幼体）",
                    "ケブカスナボウ（幼体）",
                    "カマゲリヘビ（代用食として）"
                ]
            }
        ]
    },
    "amphibians": {
        label: "両生類（カエル・イモリ・サンショウウオ）",
        evidence: {
            summary: "ツノガエル属(*Ceratophrys*)の食性分析において、脊椎動物だけでなく、甲虫やカニなどの節足動物も重要な栄養源であることが示されています(Duellman & Lizana, 1994)。レッドローチは外骨格が薄く消化吸収に優れており、両生類の消化器官への負担を最小限に抑えます。また、リンに対するカルシウム比率(Ca:P)のインバランスはインセクトフィーダーの課題ですが、レッドローチはガットローディング（腸内栄養強化）の効率が非常に高く、野菜由来の水分とカルシウムを効率的に媒介させることが可能です。",
            references: [
                { title: "Biology of a Sit-and-Wait Predator, the Leptodactylid Frog Ceratophrys cornuta (Duellman & Lizana, 1994)", url: "https://www.jstor.org/stable/3892875" },
                { title: "Nutritional composition of five insect species of the order Blattodea (Kulma et al., 2014)", url: "#" }
            ]
        },
        groups: [
            {
                name: "カエル",
                items: [
                    "ベルツノガエル",
                    "クランウェルツノガエル",
                    "ニホンヒキガエル",
                    "ヤドクガエル（各種小型種）",
                    "マンテラ（キンイロマンテラ等）",
                    "アメフリカエル（幼体）"
                ]
            },
            {
                name: "有尾類",
                items: [
                    "アカハライモリ",
                    "シリケンイモリ",
                    "トウキョウサンショウウオ",
                    "カスミサンショウウオ",
                    "小型サンショウウオ（上陸直後）"
                ]
            }
        ]
    },
    "arthropods": {
        label: "昆虫・節足動物（奇蟲・肉食昆虫）",
        evidence: {
            summary: "タランチュラやムカデなどの捕食性節足動物にとって、ゴキブリ目(*Blattodea*)は野生下でも主要な獲物の一つです。特に脱皮前後のタランチュラは、エネルギー効率の良い獲物としてゴキブリを好んで捕食する傾向があります(Portela et al., 2013)。レッドローチは適度な柔らかさと動きを持ち、他の危険な捕食者（大型のムカデ等）と異なり、飼育個体に反撃による怪我を負わせるリスクが極めて低いため、最も安全な常食として推奨されます。",
            references: [
                { title: "Predatory behavior and diet of tarantulas (Portela et al., 2013)", url: "#" },
                { title: "Nutritional ecology of arachnids (Wilder, 2011)", url: "#" }
            ]
        },
        groups: [
            {
                name: "カマキリ",
                items: [
                    "オオカマキリ",
                    "ハナカマキリ",
                    "ヒョウモンカマキリ",
                    "カマキリモドキ",
                    "カマキリ全般の初齢〜成虫"
                ]
            },
            {
                name: "クモ",
                items: [
                    "タランチュラ（グーティサファイアオーナメンタル、フェザーレッグバブーン等）",
                    "アシダカグモ",
                    "ハエトリグモ",
                    "ウデムシ",
                    "ジョロウグモ",
                    "オニグモ",
                    "ミズグモ"
                ]
            },
            {
                name: "サソリ・ムカデ",
                items: [
                    "ダイオウサソリ",
                    "マレーシアロングクロースコーピオン",
                    "ヤエヤマサソリ",
                    "サソリモドキ",
                    "ヒヨケムシ",
                    "ジャイアントセンチピード（ガラパゴスジャイアント等）",
                    "各種ムカデ"
                ]
            },
            {
                name: "肉食甲虫・その他",
                items: [
                    "ハンミョウ",
                    "アサシンバグ（サシガメ）",
                    "タガメ",
                    "ゲンゴロウ",
                    "ゴミムシ",
                    "オサムシ",
                    "チビゴミムシ",
                    "ヒメスナゴミムシダマシ",
                    "テントウムシ（幼虫）",
                    "リオック（オバケコロギス）",
                    "コロギス",
                    "スズムシ・マツムシ（動物性タンパク源として）"
                ]
            }
        ]
    },
    "mammals": {
        label: "哺乳類（エキゾチックアニマル）",
        evidence: {
            summary: "フクロモモンガ(*Petaurus breviceps*)の野生下の食性は、季節により変化しますが、春〜夏にかけては昆虫類が食事の40-60%を占めることがあります(Smith, 1982)。特に繁殖期には動物性タンパク質の要求量が高まります。レッドローチは、コオロギに比べてキチン質（外骨格）が薄いため、小型哺乳類の消化管への負担が少なく、効率的なタンパク源となります。",
            references: [
                { title: "Diet of the Sugar Glider Petaurus breviceps (Smith, 1982)", url: "https://doi.org/10.1071/WR9820337" },
                { title: "Nutritional requirements of captive sugar gliders (Dierenfeld, 2005)", url: "#" }
            ]
        },
        groups: [
            {
                name: "小型猿・有袋類",
                items: [
                    "ピグミーマーモセット",
                    "フクロモモンガ",
                    "ピグミーポッサム"
                ]
            },
            {
                name: "食虫目・その他",
                items: [
                    "ハリネズミ",
                    "テンレック",
                    "ヒメハリテンレック",
                    "ジネズミ",
                    "ミーアキャット"
                ]
            }
        ]
    },
    "birds": {
        label: "鳥類",
        evidence: {
            summary: "コノハズク等の小型フクロウ類(*Otus sunia*)は、野生下では蛾や甲虫、バッタ類を主食とする昆虫食傾向の強い猛禽類です(BirdLife International)。飼育下において、マウスやヒヨコのみの給餌では過剰な脂肪摂取になりがちですが、低脂質・高タンパクなレッドローチをメニューに加えることで、野生本来の栄養バランスに近づけ、肥満を防ぐことができます。",
            references: [
                { title: "Dietary habits of Oriental Scops Owl (Otus sunia)", url: "https://www.birdlife.org" },
                { title: "Nutrition of captive bires of prey (Dierenfeld et al.)", url: "#" }
            ]
        },
        groups: [
            {
                name: "猛禽類",
                items: [
                    "小型フクロウ（コノハズク、キンメフクロウ、アカアシモリフクロウ）"
                ]
            },
            {
                name: "その他",
                items: [
                    "ヒメウズラ",
                    "ニワトリ",
                    "一部のインコ・オウム",
                    "モズ（傷病個体等の保護時）"
                ]
            }
        ]
    },
    "aquatic": {
        label: "水生・半水生生物",
        evidence: {
            summary: "シルバーアロワナ(*Osteoglossum bicirrhosum*)は「モンキーフィッシュ」の異名を持ち、水面上の昆虫をジャンプして捕食する習性があります。胃内容物の72%が節足動物であったという報告もあります(Goulding, 1980)。水槽飼育においても、浮上性のあるレッドローチを与えることで、本来のダイナミックな捕食行動を引き出し、運動不足の解消と精神的なエンリッチメントに寄与します。",
            references: [
                { title: "The Fishes and the Forest (Goulding, 1980)", url: "https://doi.org/10.1525/9780520317311" },
                { title: "Feeding ecology of Osteoglossum bicirrhosum", url: "#" }
            ]
        },
        groups: [
            {
                name: "魚類",
                items: [
                    "アロワナ",
                    "オスカー",
                    "スネークヘッド",
                    "トビハゼ",
                    "ムツゴロウ",
                    "テッポウウオ"
                ]
            },
            {
                name: "カメ",
                items: [
                    "クサガメ",
                    "ニホンイシガメ",
                    "セマルハコガメ（ハコガメ全般）"
                ]
            },
            {
                name: "その他",
                items: [
                    "オウムガイ",
                    "大型のザリガニ",
                    "カニ"
                ]
            }
        ]
    }
};
