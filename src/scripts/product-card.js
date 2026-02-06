/**
 * 製品カードモジュール
 * 購入ボックスのインタラクション処理
 * @version 4.0 - リファクタリング版
 */

import { UNIFIED_PRICE_DATA } from './product-data.js';

// =========================================================================
// 定数定義
// =========================================================================

const SUBSCRIPTION_DISCOUNT_RATE = 0.90; // 定期購入割引率 (10% OFF)
const BUTTON_TEXT = {
    NORMAL_PURCHASE: 'カートに追加',
    SUBSCRIPTION: '定期購入を開始'
};

const CSS_CLASSES = {
    ACTIVE: 'active',
    ACTIVE_SUB: 'active-sub',
    SUBSCRIBED: 'subscribed'
};

// =========================================================================
// DOM要素取得ヘルパー
// =========================================================================

/**
 * カード内の要素を取得するヘルパークラス
 */
class CardElements {
    constructor(card) {
        this.card = card;
    }

    get size() {
        return this.card.dataset.size;
    }

    get selectedQuantityButton() {
        return this.card.querySelector('.qty-btn.active');
    }

    get selectedQuantity() {
        const btn = this.selectedQuantityButton;
        return btn ? parseInt(btn.dataset.qty) : null;
    }

    get isSubscription() {
        return this.card.querySelector('.sub-option.active-sub') !== null;
    }

    get priceElement() {
        return this.card.querySelector('.price');
    }

    get currentPriceElement() {
        return this.card.querySelector('.current-price');
    }

    get unitPriceElement() {
        return this.card.querySelector('.unit-price');
    }

    get addButton() {
        return this.card.querySelector('.add-cart-btn');
    }

    get deliveryFrequencyContainer() {
        return this.card.querySelector('.delivery-freq-container');
    }
}

// =========================================================================
// 価格計算ロジック
// =========================================================================

/**
 * 価格情報を計算
 * @param {string} size - 商品サイズ (SS/S/M/L)
 * @param {number} quantity - 数量
 * @param {boolean} isSubscription - 定期購入かどうか
 * @returns {Object|null} - { totalPrice, unitPrice } または null
 */
function calculatePrice(size, quantity, isSubscription) {
    const priceData = UNIFIED_PRICE_DATA[size]?.[quantity];
    if (!priceData) return null;

    const basePrice = priceData.price;
    const totalPrice = isSubscription 
        ? Math.round(basePrice * SUBSCRIPTION_DISCOUNT_RATE) 
        : basePrice;
    const unitPrice = (totalPrice / quantity).toFixed(1);

    return { totalPrice, unitPrice };
}

/**
 * 価格表示を更新
 * @param {HTMLElement} card - 商品カード要素
 */
function updatePriceDisplay(card) {
    const elements = new CardElements(card);
    
    if (!elements.selectedQuantityButton) return;

    const priceInfo = calculatePrice(
        elements.size,
        elements.selectedQuantity,
        elements.isSubscription
    );

    if (!priceInfo) return;

    // 価格表示を更新
    if (elements.currentPriceElement) {
        elements.currentPriceElement.innerHTML = 
            `<span class="total-label">合計</span> ¥${priceInfo.totalPrice.toLocaleString()}`;
    }

    if (elements.unitPriceElement) {
        elements.unitPriceElement.textContent = 
            `(@¥${priceInfo.unitPrice} / unit)`;
    }

    // デバッグログ
    console.log(`[Price Update] Size: ${elements.size}, Qty: ${elements.selectedQuantity}, ` +
                `Total: ¥${priceInfo.totalPrice}, Unit: ¥${priceInfo.unitPrice}`);
}

// =========================================================================
// UI状態管理
// =========================================================================

/**
 * ボタングループ内の選択状態を切り替え
 * @param {HTMLElement} button - クリックされたボタン
 * @param {string} containerSelector - コンテナのセレクタ
 * @param {string} buttonSelector - ボタンのセレクタ
 */
function toggleButtonSelection(button, containerSelector, buttonSelector) {
    const container = button.closest(containerSelector);
    if (!container) return;

    container.querySelectorAll(buttonSelector).forEach(btn => {
        btn.classList.remove(CSS_CLASSES.ACTIVE);
    });
    button.classList.add(CSS_CLASSES.ACTIVE);
}

/**
 * 購入タイプに応じてUIを更新
 * @param {HTMLElement} card - 商品カード要素
 * @param {boolean} isSubscription - 定期購入かどうか
 */
function updatePurchaseTypeUI(card, isSubscription) {
    const elements = new CardElements(card);

    // 配送頻度コンテナの表示/非表示
    if (elements.deliveryFrequencyContainer) {
        elements.deliveryFrequencyContainer.classList.toggle(
            CSS_CLASSES.ACTIVE, 
            isSubscription
        );
    }

    // 価格要素のスタイル
    if (elements.priceElement) {
        elements.priceElement.classList.toggle(
            CSS_CLASSES.SUBSCRIBED, 
            isSubscription
        );
    }

    // ボタンテキスト
    if (elements.addButton) {
        elements.addButton.textContent = isSubscription 
            ? BUTTON_TEXT.SUBSCRIPTION 
            : BUTTON_TEXT.NORMAL_PURCHASE;
    }
}

// =========================================================================
// エクスポート関数（イベントハンドラー）
// =========================================================================

/**
 * 数量選択ボタンのクリックハンドラー
 * @param {HTMLElement} button - クリックされたボタン
 */
export function selectQuantity(button) {
    const card = button.closest('.product-card');
    if (!card) return;

    toggleButtonSelection(button, '.quantity-selector', '.qty-btn');
    updatePriceDisplay(card);
}

/**
 * 配送頻度選択ボタンのクリックハンドラー
 * @param {HTMLElement} button - クリックされたボタン
 */
export function selectFrequency(button) {
    const card = button.closest('.product-card');
    if (!card) return;

    toggleButtonSelection(button, '.freq-options', '.freq-option');
    updatePriceDisplay(card);
}

/**
 * 購入タイプ切り替えハンドラー
 * @param {HTMLElement} container - 切り替えコンテナ要素
 */
export function toggleSubscription(container) {
    const clickedOption = event.target.closest('.sub-option');
    if (!clickedOption) return;

    const card = container.closest('.product-card');
    if (!card) return;

    const options = container.querySelectorAll('.sub-option');
    
    // 全オプションの選択状態をクリア
    options.forEach(opt => {
        opt.classList.remove(CSS_CLASSES.ACTIVE, CSS_CLASSES.ACTIVE_SUB);
    });

    // クリックされたオプションの種類を判定
    const isSubscription = !clickedOption.innerText.includes('通常購入');

    // 選択状態を設定
    clickedOption.classList.add(
        isSubscription ? CSS_CLASSES.ACTIVE_SUB : CSS_CLASSES.ACTIVE
    );

    // UIを更新
    updatePurchaseTypeUI(card, isSubscription);
    updatePriceDisplay(card);
}

// =========================================================================
// 初期化
// =========================================================================

/**
 * イベントリスナーをアタッチ
 * @param {HTMLElement} card - 商品カード要素
 */
function attachEventListeners(card) {
    // 数量選択ボタン
    card.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function() { 
            selectQuantity(this); 
        });
    });

    // 配送頻度選択ボタン
    card.querySelectorAll('.freq-option').forEach(btn => {
        btn.addEventListener('click', function() { 
            selectFrequency(this); 
        });
    });

    // 購入タイプ切り替え
    card.querySelectorAll('.sub-toggle-container').forEach(container => {
        container.addEventListener('click', function() { 
            toggleSubscription(this); 
        });
    });
}

/**
 * 製品カードモジュールの初期化
 */
export function initProductCards() {
    console.log('[Product Card] Module v4.0 Loaded - Refactored');

    // 全商品カードを初期化
    document.querySelectorAll('.product-card').forEach(card => {
        attachEventListeners(card);
        updatePriceDisplay(card);
    });

    // グローバル関数として公開（後方互換性のため）
    window.selectQuantity = selectQuantity;
    window.toggleSubscription = toggleSubscription;
    window.selectFrequency = selectFrequency;
}

// DOMContentLoaded時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductCards);
} else {
    initProductCards();
}
