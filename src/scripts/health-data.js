/**
 * Health Check Data (Reptiles)
 * Diagnostic criteria based on veterinary literature.
 * Score: 0=Good, 1=Warning, 2=Critical
 */

export const HEALTH_DATA = {
    settings: {
        title: "Reptile Health Check (爬虫類健康診断)",
        disclaimer: "【免責事項】この診断ツールは、学術的知見に基づき作成されていますが、獣医師による実際の診断に代わるものではありません。緊急を要する症状がある場合は、直ちに動物病院を受診してください。"
    },
    categories: [
        {
            id: "nutrition",
            title: "1. Nutrition (栄養状態)",
            description: "BCS（ボディコンディションスコア）に基づく評価",
            ref_keyword: "Nutrition",
            questions: [
                {
                    id: "bcs_eval",
                    text: "尾や脇腹に十分な肉付きがありますか？（BCS評価）",
                    academic_note: "💡 尾の太さは栄養貯蔵の指標です。痩せすぎはMBD（代謝性骨疾患）のリスクを示唆し、適切なCa:P比率の給餌が必要です。",
                    options: [
                        { label: "はい、ふっくらとして弾力がある (良好)", score: 0, status: "good" },
                        { label: "少し細い気がする (注意)", score: 1, status: "warning" },
                        { label: "いいえ、骨が浮き出ている (要相談)", score: 2, status: "critical" }
                    ]
                }
            ]
        },
        {
            id: "physical",
            title: "2. Physical (外見の変化)",
            description: "臨床的兆候の確認",
            ref_keyword: "Veterinary",
            questions: [
                {
                    id: "physical_check",
                    text: "目や鼻に濁り、分泌物、脱皮不全はありませんか？",
                    academic_note: "💡 目の腫れや鼻汁は、ビタミンA欠乏症やRNS（呼吸器感染症）の初期徴候である可能性があります。",
                    options: [
                        { label: "いいえ、綺麗です (良好)", score: 0, status: "good" },
                        { label: "少し気になる点がある (注意)", score: 1, status: "warning" },
                        { label: "はい、明らかに異常がある (要相談)", score: 2, status: "critical" }
                    ]
                }
            ]
        },
        {
            id: "elimination",
            title: "3. Elimination (排泄)",
            description: "内臓機能と脱水の指標",
            ref_keyword: "Veterinary",
            questions: [
                {
                    id: "feces_check",
                    text: "糞の状態は固形で、尿酸（白い部分）に変色はありませんか？",
                    academic_note: "💡 尿酸の黄ばみは脱水症状のサインです。また、未消化便や悪臭は内部寄生虫や消化不良を示唆します。",
                    options: [
                        { label: "はい、正常な状態です (良好)", score: 0, status: "good" },
                        { label: "少し柔らかい / 黄ばみがある (注意)", score: 1, status: "warning" },
                        { label: "いいえ、下痢や血便がある (要相談)", score: 2, status: "critical" }
                    ]
                }
            ]
        },
        {
            id: "behavior",
            title: "4. Behavior (行動・活性)",
            description: "神経症状とストレス評価",
            ref_keyword: "Husbandry",
            questions: [
                {
                    id: "behavior_check",
                    text: "四肢の震えや、異常な嗜眠（ずっと寝ている等）はありませんか？",
                    academic_note: "💡 四肢の震えは低カルシウム血症による神経症状の可能性があります。環境エンリッチメント不足も不活発の原因となります。",
                    options: [
                        { label: "いいえ、活発に動いています (良好)", score: 0, status: "good" },
                        { label: "あまり動かない時がある (注意)", score: 1, status: "warning" },
                        { label: "はい、震えやふらつきがある (要相談)", score: 2, status: "critical" }
                    ]
                }
            ]
        },
        {
            id: "environment",
            title: "5. Environment (飼育環境)",
            description: "POTZ（好適体温）と免疫機能",
            ref_keyword: "Environment",
            questions: [
                {
                    id: "env_check",
                    text: "ケージ内に温度勾配（暑い場所と涼しい場所）がありますか？",
                    academic_note: "💡 変温動物の免疫機能は、POTZ（好適体温域）内での体温調節によって最大化されます。一律の保温では不十分な場合があります。",
                    options: [
                        { label: "はい、ホットスポットがある (良好)", score: 0, status: "good" },
                        { label: "温度計がない / わからない (注意)", score: 1, status: "warning" },
                        { label: "いいえ、一定温度で管理している (要相談)", score: 2, status: "critical" }
                    ]
                }
            ]
        }
    ]
};
