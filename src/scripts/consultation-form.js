/**
 * 個別相談フォームモジュール
 * フォームの送信処理と成功メッセージの表示を管理
 */

export function initConsultationForm() {
    const form = document.getElementById('consultForm');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    if (!form || !successMsg || !resetBtn) {
        console.warn('Consultation form elements not found');
        return;
    }

    // フォーム送信処理
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // フォームをフェードアウト
        form.style.opacity = '0';

        setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            // リフローをトリガー
            void successMsg.offsetWidth;
            successMsg.style.opacity = '1';
            successMsg.classList.add('visible');
        }, 300);
    });

    // リセットボタン処理
    resetBtn.addEventListener('click', () => {
        successMsg.style.opacity = '0';
        setTimeout(() => {
            successMsg.style.display = 'none';
            form.style.display = 'block';
            void form.offsetWidth;
            form.style.opacity = '1';
            form.reset();
        }, 300);
    });
}
