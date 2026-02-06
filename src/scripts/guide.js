/**
 * 飼育ガイドページのロジック
 * (現在は特になし - 必要に応じて追加)
 */

/**
 * 初期化関数 - DOMContentLoadedで呼び出される
 */
export function initGuidePage() {
    console.log("Guide: Initializing guide page...");
}

// DOMContentLoadedで初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuidePage);
} else {
    initGuidePage();
}
