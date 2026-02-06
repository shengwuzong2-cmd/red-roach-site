/**
 * Health Check Module
 * 健康診断システム - 5つの質問で生体の健康状態を評価
 * 
 * WARNING: このファイルは健康診断の重要なロジックを含んでいます。
 * 編集する際は十分に注意してください。
 */

(function () {
    // 質問データ
    const questions = [
        {
            c: "1. Nutrition (栄養状態)",
            d: "BCS(ボディコンディションスコア)に基づく評価",
            q: "尾や脇腹に十分な肉付きがありますか?(BCS評価)",
            n: "💡 尾の太さは栄養貯蔵の指標です。痩せすぎはMBD(代謝性骨疾患)のリスクを示唆します。",
            o: [
                { t: "はい、ふっくらとして弾力がある (良好)", s: 0 },
                { t: "少し細い気がする (注意)", s: 1 },
                { t: "いいえ、骨が浮き出ている (要相談)", s: 2 }
            ]
        },
        {
            c: "2. Physical (外見の変化)",
            d: "臨床的兆候の確認",
            q: "目や鼻に濁り、分泌物、脱皮不全はありませんか?",
            n: "💡 目の腫れや鼻汁は、ビタミンA欠乏症やRNS(呼吸器感染症)の初期徴候です。",
            o: [
                { t: "いいえ、綺麗です (良好)", s: 0 },
                { t: "少し気になる点がある (注意)", s: 1 },
                { t: "はい、明らかに異常がある (要相談)", s: 2 }
            ]
        },
        {
            c: "3. Elimination (排泄)",
            d: "内臓機能と脱水の指標",
            q: "糞の状態は固形で、尿酸(白い部分)に変色はありませんか?",
            n: "💡 尿酸の黄ばみは脱水症状のサインです。未消化便は内部寄生虫を示唆します。",
            o: [
                { t: "はい、正常な状態です (良好)", s: 0 },
                { t: "少し柔らかい / 黄ばみがある (注意)", s: 1 },
                { t: "いいえ、下痢や血便がある (要相談)", s: 2 }
            ]
        },
        {
            c: "4. Behavior (行動・活性)",
            d: "神経症状とストレス評価",
            q: "四肢の震えや、異常な嗜眠(ずっと寝ている等)はありませんか?",
            n: "💡 四肢の震えは低カルシウム血症による神経症状の可能性があります。",
            o: [
                { t: "いいえ、活発に動いています (良好)", s: 0 },
                { t: "あまり動かない時がある (注意)", s: 1 },
                { t: "はい、震えやふらつきがある (要相談)", s: 2 }
            ]
        },
        {
            c: "5. Environment (飼育環境)",
            d: "POTZ(好適体温)と免疫機能",
            q: "ケージ内に温度勾配(暑い場所と涼しい場所)がありますか?",
            n: "💡 変温動物の免疫機能は、POTZ(好適体温域)内での体温調節で最大化されます。",
            o: [
                { t: "はい、ホットスポットがある (良好)", s: 0 },
                { t: "温度計がない / わからない (注意)", s: 1 },
                { t: "いいえ、一定温度で管理している (要相談)", s: 2 }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let answers = [];

    // グローバル関数として公開（HTMLから呼び出されるため）
    window.selectHealthAnswer = function (answerIndex) {
        answers[currentQuestionIndex] = answerIndex;
        showQuestion();
    };

    /**
     * 質問を表示する
     */
    function showQuestion() {
        const container = document.getElementById('questionContainer');
        if (!container) return;

        const progressBar = document.getElementById('healthProgressBar');
        const questionNum = document.getElementById('currentQuestionNum');

        // プログレスバー更新
        if (progressBar) {
            progressBar.style.width = ((currentQuestionIndex + 1) / questions.length * 100) + '%';
        }
        if (questionNum) {
            questionNum.textContent = currentQuestionIndex + 1;
        }

        const q = questions[currentQuestionIndex];
        let html = '<div class="question-box">';
        html += '<h3 class="health-cat-title">' + q.c + '</h3>';
        html += '<p class="health-cat-desc">' + q.d + '</p>';
        html += '<div class="health-question">';
        html += '<p class="q-text">' + q.q + '</p>';
        html += '<div class="health-options">';

        // 選択肢を生成
        for (let j = 0; j < q.o.length; j++) {
            const selected = answers[currentQuestionIndex] === j ? ' selected' : '';
            html += '<label class="health-option-label' + selected + '" onclick="selectHealthAnswer(' + j + ')">';
            html += q.o[j].t;
            html += '</label>';
        }

        html += '</div></div>';

        // Academic Noteを追加
        if (q.n) {
            html += '<div class="evidence-box" style="margin-top:24px">';
            html += '<div class="evidence-header">';
            html += '<span class="evidence-icon">🎓</span> ACADEMIC NOTE';
            html += '</div>';
            html += '<p class="evidence-text">' + q.n + '</p>';
            html += '</div>';
        }

        html += '</div>';
        container.innerHTML = html;

        // ナビゲーションボタンの状態を更新
        updateNavigationButtons();
    }

    /**
     * ナビゲーションボタンの状態を更新
     */
    function updateNavigationButtons() {
        const prevBtn = document.getElementById('healthPrevBtn');
        const nextBtn = document.getElementById('healthNextBtn');

        if (prevBtn) {
            prevBtn.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
        }

        if (nextBtn) {
            nextBtn.disabled = answers[currentQuestionIndex] === undefined;

            // 最後の質問ではチェックマークアイコンを表示
            if (currentQuestionIndex === questions.length - 1) {
                nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7"/></svg>';
                nextBtn.setAttribute('aria-label', '結果を表示');
            } else {
                nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
                nextBtn.setAttribute('aria-label', '次の質問');
            }
        }
    }

    /**
     * 結果を計算して表示
     */
    function showResult() {
        let totalScore = 0;
        let criticalCount = 0;
        let warningCount = 0;

        // スコアを集計
        for (let j = 0; j < answers.length; j++) {
            const score = questions[j].o[answers[j]].s;
            totalScore += score;
            if (score === 2) criticalCount++;
            if (score === 1) warningCount++;
        }

        let icon, title, description, advice;

        // リスクレベルを判定
        if (criticalCount >= 2 || totalScore >= 6) {
            icon = '🚨';
            title = '要獣医診察';
            description = '複数の重大な兆候が検出されました。速やかに専門医の診察を受けることを強く推奨します。';
            advice = '<h4 style="color:#E53E3E;margin-bottom:16px">推奨アクション:</h4>';
            advice += '<ul style="text-align:left;max-width:500px;margin:0 auto;line-height:2">';
            advice += '<li>🏥 <strong>エキゾチックアニマル専門の動物病院</strong>を受診してください</li>';
            advice += '<li>📋 症状を記録し、獣医師に提示してください</li>';
            advice += '<li>⏰ 症状が悪化する前に、早急な対応が必要です</li>';
            advice += '</ul>';
        } else if (warningCount >= 2 || totalScore >= 3) {
            icon = '⚠️';
            title = '要観察';
            description = 'いくつかの注意すべき兆候が見られます。飼育環境の見直しと継続的な観察が必要です。';
            advice = '<h4 style="color:#DD6B20;margin-bottom:16px">推奨アクション:</h4>';
            advice += '<ul style="text-align:left;max-width:500px;margin:0 auto;line-height:2">';
            advice += '<li>🌡️ 温度・湿度の環境パラメータを再確認してください</li>';
            advice += '<li>🍽️ 給餌内容とカルシウム添加を見直してください</li>';
            advice += '<li>📊 1週間後に再度チェックし、改善がなければ受診を検討してください</li>';
            advice += '</ul>';
        } else {
            icon = '✅';
            title = '良好';
            description = '現時点では大きな問題は検出されませんでした。引き続き適切な飼育管理を継続してください。';
            advice = '<h4 style="color:#38A169;margin-bottom:16px">推奨アクション:</h4>';
            advice += '<ul style="text-align:left;max-width:500px;margin:0 auto;line-height:2">';
            advice += '<li>✨ 現在の飼育環境を維持してください</li>';
            advice += '<li>📅 定期的な健康チェック(月1回)を習慣化しましょう</li>';
            advice += '<li>📚 最新の飼育知見を学び続けることを推奨します</li>';
            advice += '</ul>';
        }

        // 結果を表示
        document.getElementById('resultIcon').textContent = icon;
        document.getElementById('resultTitle').textContent = title;
        document.getElementById('resultDesc').textContent = description;
        document.getElementById('resultAdvice').innerHTML = '<div class="result-advice">' + advice + '</div>';

        const disclaimer = document.getElementById('healthDisclaimer');
        if (disclaimer) {
            disclaimer.textContent = '【免責事項】この診断ツールは学術的知見に基づき作成されていますが、獣医師による実際の診断に代わるものではありません。';
        }

        // 表示を切り替え
        document.getElementById('healthCheckContainer').style.display = 'none';
        document.getElementById('healthResult').style.display = 'block';
    }

    /**
     * 初期化
     */
    document.addEventListener('DOMContentLoaded', function () {
        if (!document.getElementById('questionContainer')) return;

        // 最初の質問を表示
        showQuestion();

        // イベントリスナーを設定
        const prevBtn = document.getElementById('healthPrevBtn');
        const nextBtn = document.getElementById('healthNextBtn');
        const restartBtn = document.getElementById('restartCheckBtn');
        const proceedBtn = document.getElementById('proceedToFormBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', function () {
                if (currentQuestionIndex > 0) {
                    currentQuestionIndex--;
                    showQuestion();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', function () {
                if (currentQuestionIndex < questions.length - 1) {
                    currentQuestionIndex++;
                    showQuestion();
                } else {
                    showResult();
                }
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', function () {
                currentQuestionIndex = 0;
                answers = [];
                document.getElementById('healthResult').style.display = 'none';
                document.getElementById('healthCheckContainer').style.display = 'block';
                showQuestion();
            });
        }

        if (proceedBtn) {
            proceedBtn.addEventListener('click', function () {
                const formSection = document.querySelector('.form-section');
                if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });
})();
