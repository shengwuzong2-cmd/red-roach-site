/**
 * 爬虫類餌データベース (Feeder Database) マスターデータ
 * 全データは乾燥重量ベース(Dry Matter Basis)で統一
 * 更新日: 2026-02-05
 */
export const FEEDER_DATA = [
    {
        categoryInfo: {
            title: "🦗 活餌昆虫 (Primary Insects)",
            id: "insects"
        },
        items: [
            {
                name: "イエコオロギ",
                icon: "🦗",
                sciName: "Acheta domesticus",
                stats: {
                    protein: { val: "60.5%", width: "60%" },
                    fat: { val: "21.0%", width: "21%" },
                    cap: { val: "1 : 5.6 (不適)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "最も標準的な活餌。動きが早く、多くのトカゲやヤモリの捕食本能を刺激する。アゴが弱く安全。タンパク質60.5%、脂質21.0%(乾燥重量)。",
                    note: "カルシウム不足が顕著(Ca:P比 0.18:1)なため、毎回のダスティングが必須。必須アミノ酸を全て含有。",
                    references: [
                        { title: "Nutritional composition of common commercial feeder insects", source: "Finke, M.D. (2002)" },
                        { title: "統合研究データ(8+ソース)", source: "2010-2024年の複数研究" }
                    ]
                }
            },
            {
                name: "フタホシコオロギ",
                icon: "🦗",
                sciName: "Gryllus bimaculatus",
                stats: {
                    protein: { val: "59.5%", width: "60%" },
                    fat: { val: "22.0%", width: "22%" },
                    cap: { val: "1 : 3 (不適)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "イエコよりボリュームがあり、大型種向け。アゴが強く噛むことがあるため注意が必要。タンパク質59.5%、脂質22.0%(乾燥重量)。",
                    note: "オメガ3/6脂肪酸が豊富だが、リン含有量が高いためカルシウム添加は必須。ミネラル含有量が豊富。"
                }
            },
            {
                name: "デュビア",
                icon: "🪳",
                sciName: "Blaptica dubia",
                stats: {
                    protein: { val: "57.4%", width: "57%" },
                    fat: { val: "40.0%", width: "40%" },
                    cap: { val: "1 : 5 (不適)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "臭いが少なく管理が楽。動きが遅く捕まえやすい。タンパク質57.4%、脂質40.0%(乾燥重量)。成虫は亜成虫より高タンパク・低脂質。",
                    note: "キチン質が比較的少なく消化しやすい。ガットローディング48時間でCa:P比2.1:1(理想値)達成可能。",
                    references: [
                        { title: "Nutritional value of three Blattodea species used as feed for animals", source: "Kulma et al. (2016)" },
                        { title: "Complete nutrient composition of commercially raised invertebrates", source: "Finke, M.D. (2013)" },
                        { title: "統合研究データ(5+ソース)", source: "2015-2024年の複数研究" }
                    ]
                }
            },
            {
                name: "レッドローチ",
                icon: "🪳",
                sciName: "Shelfordella lateralis",
                stats: {
                    protein: { val: "50-70%", width: "70%" },
                    fat: { val: "14-27%", width: "20%" },
                    cap: { val: "1 : 4.5 (不適)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "非常に動きが早く、食欲を刺激する。小型爬虫類に最適。壁を登らない。必須アミノ酸が豊富で、オレイン酸・リノール酸・パルミチン酸を多く含む。",
                    note: "幼体は非常に高タンパク(70%+)。ビタミンB12が豊富。外骨格が柔らかく消化吸収が良い。デュビアより脂質が低めで日常給餌に適している。",
                    references: [
                        { title: "Nutritional value of three Blattodea species used as feed for animals", source: "Kulma et al. (2016)" },
                        { title: "Pyrotag Sequencing of the Gut Microbiota of Shelfordella lateralis", source: "Schauer et al. (2012)" },
                        { title: "Nutritional Analysis Review", source: "Literature Review (2024)" }
                    ]
                }
            },
            {
                name: "ショウジョウバエ",
                icon: "🪰",
                sciName: "Drosophila",
                stats: {
                    protein: { val: "50-60%", width: "55%" },
                    fat: { val: "15-30%", width: "25%" },
                    cap: { val: "1 : 5 (不適)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "小型ヤモリやカエルの幼体に必須。飛ばない品種(ウィングレス)が一般的。タンパク質50-60%、脂質15-30%(乾燥重量)。栄養価は育てるエサ(培地)に強く依存。",
                    note: "カルシウム不足のため、毎回必ずカルシウムパウダーをまぶして与えること。種類は2種類:キイロショウジョウバエ(小型)とトリニドショウジョウバエ(大型で脂質やや低め)。市販の栄養強化培地(Repashy等)を使うと栄養価が安定します。",
                    references: [
                        { title: "Complete nutrient composition of commercially raised invertebrates", source: "Finke, M.D. (2013)" },
                        { title: "Nutritional composition of Drosophila species", source: "Literature Review (2020-2024)" },
                        { title: "詳細調査レポート(獣医学・研究・飼育者視点)", source: "統合研究データ (2026)" }
                    ]
                }
            }
        ]
    },
    {
        categoryInfo: {
            title: "🐛 ワーム・幼虫 (Worms & Larvae)",
            id: "worms"
        },
        items: [
            {
                name: "ミルワーム",
                icon: "🐛",
                sciName: "Tenebrio molitor",
                stats: {
                    protein: { val: "53.9%", width: "54%" },
                    fat: { val: "29.5%", width: "30%" },
                    cap: { val: "1 : 14 (危険)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "保存が容易で安価。おやつや副食として優秀。冷蔵庫で活動を抑制できる。タンパク質53.9%、脂質29.5%(乾燥重量)。",
                    note: "外骨格(キチン質)がやや硬いため、幼体への与え過ぎに注意。高タンパク質飼料で飼育すると70%以上のタンパク質含有。",
                    references: [
                        { title: "統合研究データ(8+ソース)", source: "2010-2024年の複数研究" },
                        { title: "Zimbabwe産ミルワーム分析", source: "EAS Letters (2020年代)" }
                    ]
                }
            },
            {
                name: "ジャイアントミルワーム",
                icon: "🐛",
                sciName: "Zophobas morio",
                stats: {
                    protein: { val: "46.8%", width: "47%" },
                    fat: { val: "40.0%", width: "40%" },
                    cap: { val: "1 : 7.1 (危険)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "ボリュームがあり食いつき抜群だが、脂肪分が非常に多い(40%)。大型種のおやつに。タンパク質46.8%(乾燥重量)。エネルギー575 kcal/100g。",
                    note: "アゴが強く消化管を傷つける可能性があるため、頭を潰して与えることもある。Ca:P比0.14:1と非常に低いため、カルシウム添加必須。主食には不向き。",
                    references: [
                        { title: "統合研究データ(5+ソース)", source: "2010-2024年の複数研究" }
                    ]
                }
            },
            {
                name: "シルクワーム",
                icon: "🐛",
                sciName: "Bombyx mori",
                stats: {
                    protein: { val: "58.0%", width: "58%" },
                    fat: { val: "低", width: "10%" },
                    cap: { val: "1 : 3 (不適)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "非常に柔らかく、消化吸収が良い。水分補給にも最適。拒食時の立ち上げに有効。タンパク質58.0%(乾燥重量、幼虫)。",
                    note: "セラペプターゼという酵素を含み、カルシウム吸収を助けると言われる。脂質が低く、高タンパク質源として優秀。",
                    references: [
                        { title: "統合研究データ", source: "2020-2024年の複数研究" }
                    ]
                }
            },
            {
                name: "ハニーワーム",
                icon: "🐛",
                sciName: "Galleria mellonella",
                stats: {
                    protein: { val: "36.0%", width: "36%" },
                    fat: { val: "50.0%", width: "50%" },
                    cap: { val: "1 : 7 (危険)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "「爬虫類のお菓子」。嗜好性は最強だが、非常に太りやすい(脂質50%)。拒食個体や産卵後の回復に限定すべき。タンパク質36.0%(乾燥重量)。",
                    note: "Ca:P比が極めて低く、常用は推奨されない。エネルギー補給や食欲刺激の目的で少量使用。",
                    references: [
                        { title: "統合研究データ", source: "2020-2024年の複数研究" }
                    ]
                }
            }
        ]
    },
    {
        categoryInfo: {
            title: "🥬 植物・その他 (Plants & Others)",
            id: "plants"
        },
        items: [
            {
                name: "マウス (アダルト)",
                icon: "🐁",
                sciName: "Mus musculus",
                stats: {
                    protein: { val: "54-60%", width: "60%" },
                    fat: { val: "18-30%", width: "30%" },
                    cap: { val: "1.5 : 1 (適正)", class: "cap-good", label: "Ca:P比" }
                },
                info: {
                    insight: "骨格が形成されたアダルトマウスは完全栄養食。ピンクマウスは脂肪分が多くCaが少ないため注意。",
                    note: null
                }
            },
            {
                name: "小松菜",
                icon: "🥬",
                sciName: "Japanese Mustard Spinach",
                stats: {
                    protein: null,
                    fat: null,
                    cap: { val: "3 : 1 (最適)", class: "cap-good", label: "Ca:P比" }
                },
                info: {
                    insight: "シュウ酸が少なくカルシウムが豊富なため、毎日与えられる最高の主要野菜。",
                    note: null
                }
            },
            {
                name: "桑の葉",
                icon: "🍃",
                sciName: "Morus",
                stats: {
                    protein: { val: "15-28%", width: "28%" },
                    fat: null,
                    cap: { val: "2.3 : 1 (最適)", class: "cap-good", label: "Ca:P比" }
                },
                info: {
                    insight: "驚異的なカルシウム含有量(牛乳の25倍)。タンパク質も豊富。フトアゴやリクガメに最適。",
                    note: null
                }
            },
            {
                name: "バナナ",
                icon: "🍌",
                sciName: "Musa",
                stats: {
                    protein: null,
                    fat: null,
                    cap: { val: "1 : 3 (逆転 ⚠️)", class: "cap-bad", label: "Ca:P比" }
                },
                info: {
                    insight: "嗜好性は高いが、リンが多くカルシウム吸収を阻害する。糖分も多いため、たまのおやつ限定。",
                    note: null
                }
            },
            {
                name: "人工飼料",
                icon: "💊",
                sciName: "Pellet & Gel",
                stats: null,
                info: {
                    insight: "<strong>ペレット:</strong> 保存◎だが水分不足に注意。<br><strong>ゲル:</strong> 水分＆嗜好性◎だが保存期間が短い。<br>単食にせず、バリエーションの一つとして活用推奨。",
                    note: null
                }
            }
        ]
    }
];
