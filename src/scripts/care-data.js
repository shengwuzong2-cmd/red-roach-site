/**
 * Care & Maintenance Academic Evidence
 * Used for dynamic insights in Consultation Room
 */

export const CARE_DATA = {
    "environment": {
        label: "Environment (飼育環境)",
        insights: [
            {
                topic: "POTZ & Vitamin D3",
                summary: "爬虫類の健康維持には「好適体温域(POTZ)」の維持とUVB照射によるビタミンD3合成が不可欠です。ビタミンD3はカルシウム代謝を制御し、骨の健康を保つために重要です。多くの昼行性爬虫類は皮膚でのD3合成に依存しており、種ごとに適切なUVB波長(290-315nm)と照射時間が必要です(UV Guide UK; Utrecht University)。",
                refs: [
                    { title: "Vitamin D3 synthesis in reptiles (Utrecht Univ.)", url: "https://www.uu.nl" },
                    { title: "UVB Lighting for Reptiles (UV Guide UK)", url: "http://www.uvguide.co.uk" }
                ]
            },
            {
                topic: "Environmental Enrichment",
                summary: "環境エンリッチメントは、飼育個体の「採餌行動(Foraging behavior)」を引き出し、運動不足や異常行動を防ぐ効果があります。隠れ場所の多様化や、餌を探させるレイアウト（Scent trails等）は、爬虫類の探索意欲を高め、認知的健康を促進することが学術的に示されています(BHS; RSPCA)。",
                refs: [
                    { title: "Environmental Enrichment for Reptiles (BHS)", url: "https://www.thebhs.org" },
                    { title: "Reptile Foraging & Enrichment (RSPCA)", url: "https://kb.rspca.org.au" }
                ]
            }
        ]
    },
    "health": {
        label: "Health (健康・予防医学)",
        insights: [
            {
                topic: "MBD Prevention",
                summary: "代謝性骨疾患(MBD)は、カルシウム・リン比率(Ca:P)の不均衡により発生する一般的な疾患です。理想的なCa:P比率は2:1ですが、一般的な餌昆虫はリン過多の傾向があります。適切なサプリメント添加とUVB照射、そしてCa:Pバランスの改善された餌（ガットローディング済）を与えることが予防の鍵です(MSD Vet Manual)。",
                refs: [
                    { title: "Metabolic Bone Disease in Reptiles (MSD Vet Manual)", url: "https://www.msdvetmanual.com" },
                    { title: "Calcium-Phosphorus Ratio in Reptile Diet", url: "#" }
                ]
            },
            {
                topic: "Parasite Control",
                summary: "野生個体と比較して、閉鎖環境である飼育下では寄生虫の再感染リスクが高まります。定期的な糞便検査によるスクリーニングが推奨されます。また、適切な床材管理と衛生的な給餌（清潔な昆虫の使用）が内部寄生虫のリスクを低減させます。",
                refs: [
                    { title: "Parasite Management in Captive Reptiles", url: "#" }
                ]
            }
        ],
        checklist: [
            "食欲・排泄は毎日ありますか？",
            "脱皮不全（指先・尾先）はありませんか？",
            "自発的な運動（探索行動）は見られますか？",
            "皮膚の色艶や弾力に異常はありませんか？"
        ]
    },
    "nutrition": {
        label: "Nutrition (栄養・給餌)",
        insights: [
            {
                topic: "Gut Loading Efficiency",
                summary: "「ガットローディング」は、餌昆虫の栄養価を劇的に向上させる技術です。研究によると、カルシウム強化飼料を与えたミルワームやコオロギは、24〜48時間以内にCa含有量が有意に上昇し、Ca:P比率が改善されることが示されています(Finke, 2003; Fluker Farms)。レッドローチは食欲旺盛で消化管充満率が高く、効率的な栄養の運び手となります。",
                refs: [
                    { title: "Gut loading to enhance nutritional value (Finke, 2003)", url: "#" },
                    { title: "Invertebrate Nutrient Composition", url: "https://flukerfarms.com" }
                ]
            },
            {
                topic: "Chitin & Digestibility",
                summary: "昆虫の外骨格を構成するキチン質は、一部の動物にとって消化の負担となる場合があります。しかし、レッドローチはコオロギ等と比較して外骨格が薄く柔らかいため、消化吸収率に優れ、特に消化機能の未熟な幼体や老齢個体にとって理想的なタンパク源となります。",
                refs: [
                    { title: "Digestibility of insect chitin in reptiles", url: "#" }
                ]
            }
        ]
    }
};
