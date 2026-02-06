/**
 * 製品選択インタラクションの初期化
 * - サイズと数量の選択を管理
 * - 価格計算と表示
 * - チェックアウトへのリダイレクト
 */
export function initProductSelection() {
    // 選択状態の管理
    const state = {
        size: null,
        qty: null
    };

    // DOM要素の取得
    const sizeTiles = document.querySelectorAll('#size-grid .selection-tile');
    const qtyTiles = document.querySelectorAll('#qty-grid .selection-tile');
    const qtySection = document.getElementById('quantity-section');
    const subscribeBtn = document.getElementById('subscribe-btn');
    const priceDisplay = document.getElementById('price-display');

    // 価格マッピング（サイズごとの単価）
    const prices = {
        'S': 25,
        'M': 30,
        'L': 35
    };

    // チェックアウトリンク（サイズ_数量の組み合わせ）
    // 実際の決済システムのURLに置き換える必要があります
    const checkoutLinks = {
        'S_100': 'https://example.com/checkout/s100',
        'S_200': 'https://example.com/checkout/s200',
        'S_300': 'https://example.com/checkout/s300',
        'M_100': 'https://example.com/checkout/m100',
        'M_200': 'https://example.com/checkout/m200',
        'M_300': 'https://example.com/checkout/m300',
        'L_100': 'https://example.com/checkout/l100',
        'L_200': 'https://example.com/checkout/l200',
        'L_300': 'https://example.com/checkout/l300',
    };

    /**
     * UIの更新（価格表示とボタンの有効化）
     */
    function updateUI() {
        if (state.size && state.qty) {
            // 価格計算
            const unitPrice = prices[state.size];
            const total = unitPrice * parseInt(state.qty);
            priceDisplay.textContent = `¥${total.toLocaleString()} (Tax included)`;

            // ボタンを有効化
            subscribeBtn.classList.add('active');
        } else {
            // 選択が不完全な場合
            priceDisplay.textContent = 'Select options...';
            subscribeBtn.classList.remove('active');
        }
    }

    /**
     * サイズ選択のイベントリスナー
     */
    sizeTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            // 他の選択を解除
            sizeTiles.forEach(t => t.classList.remove('selected'));

            // 現在のタイルを選択
            tile.classList.add('selected');
            state.size = tile.dataset.size;

            // 数量選択セクションを表示
            qtySection.classList.add('visible');
            updateUI();
        });
    });

    /**
     * 数量選択のイベントリスナー
     */
    qtyTiles.forEach(tile => {
        tile.addEventListener('click', () => {
            // 他の選択を解除
            qtyTiles.forEach(t => t.classList.remove('selected'));

            // 現在のタイルを選択
            tile.classList.add('selected');
            state.qty = tile.dataset.qty;
            updateUI();
        });
    });

    /**
     * サブスクリプションボタンのクリックイベント
     */
    subscribeBtn.addEventListener('click', () => {
        // 選択が不完全な場合は何もしない
        if (!state.size || !state.qty) {
            console.warn('Please select both size and quantity');
            return;
        }

        // チェックアウトリンクを取得
        const key = `${state.size}_${state.qty}`;
        const url = checkoutLinks[key];

        // リダイレクト
        if (url) {
            console.log(`Redirecting to checkout: ${key}`);
            window.location.href = url;
        } else {
            console.error(`Checkout link not configured for: ${key}`);
            alert('Checkout link not configured for this combination.');
        }
    });
}
