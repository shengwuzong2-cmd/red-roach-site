// Q&A Data for Guide Page
// 6 questions organized into 3 categories

export const GUIDE_QA_CATEGORIES = [
    {
        id: 'husbandry',
        icon: '🏠',
        title: '飼育管理',
        questions: [
            {
                question: '臭いはありますか？',
                answer: `<p>適切な飼育環境では、ほとんど臭いはありません。週1回の清掃と適切な換気で、快適な環境を維持できます。</p>
<p><strong>臭い対策のポイント:</strong></p>
<ul>
<li>食べ残しを放置しない</li>
<li>床材を定期的に交換（2週間に1回）</li>
<li>通気性の良いケースを使用</li>
</ul>`
            },
            {
                question: 'どのくらい日持ちしますか？',
                answer: `<p>適切な温度・湿度管理下で、<strong>3〜6ヶ月</strong>の飼育が可能です。餌と水を定期的に与えることが重要です。</p>
<p><strong>長期保管のコツ:</strong></p>
<ul>
<li>温度25〜28°C、湿度50%を維持</li>
<li>週2〜3回、野菜や果物を与える</li>
<li>過密飼育を避ける（100pcsあたり30cm×20cmケース）</li>
</ul>`
            },
            {
                question: '初心者でも飼育できますか？',
                answer: `<p>はい、レッドローチは<strong>非常に丈夫</strong>で、初心者にも適しています。このガイドに従えば、失敗することはほとんどありません。</p>
<p><strong>初心者向けスターターセット:</strong></p>
<ul>
<li>飼育ケース（蓋付き）</li>
<li>デジタル温湿度計</li>
<li>床材（新聞紙またはペットシーツ）</li>
<li>餌（ラビットフード + 野菜）</li>
</ul>`
            }
        ]
    },
    {
        id: 'troubleshooting',
        icon: '⚠️',
        title: 'トラブル対応',
        questions: [
            {
                question: '死着したらどうすればいいですか？',
                answer: `<p>到着後24時間以内にご連絡ください。写真を添えてご報告いただければ、迅速に対応いたします。</p>
<p><strong>補償内容:</strong> 死着数に応じて、次回購入時に使用できるクーポンを発行いたします。</p>`
            },
            {
                question: '脱走対策は必要ですか？',
                answer: `<p>はい、必須です。レッドローチは壁を登ることができるため、<strong>蓋付きのケース</strong>を使用してください。</p>
<p><strong>推奨ケース:</strong> プラスチック製の飼育ケース（蓋に通気穴があるもの）</p>`
            }
        ]
    },
    {
        id: 'breeding',
        icon: '🥚',
        title: '繁殖・増殖',
        questions: [
            {
                question: '繁殖させることはできますか？',
                answer: `<p>可能です。温度28°C、湿度60%の環境下で、雌雄を一緒に飼育すると自然に繁殖します。</p>
<p><strong>繁殖のポイント:</strong></p>
<ul>
<li>卵鞘（卵のカプセル）を見つけたら、別容器で管理</li>
<li>孵化まで約4〜6週間</li>
<li>幼虫は成虫と同じ餌でOK</li>
</ul>`
            }
        ]
    }
];
