import { initLabMonitor } from './monitor.js';

/**
 * グローバル機能の初期化
 * - ラボモニターシステムの起動
 * - フェードインアニメーションの設定
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Main: Initializing global features...");

    try {
        // ラボモニターシステムの初期化
        initLabMonitor();
    } catch (e) { console.error("Monitor init failed", e); }

    try {
        // フェードインアニメーションの設定
        setupRevealAnimations();
    } catch (e) { console.error("Animations init failed", e); }

    try {
        // サイドメニューの初期化
        initSideMenu();
    } catch (e) { console.error("SideMenu init failed", e); }
});

/**
 * サイドメニュー（ドロワー）の初期化
 */
function initSideMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer = document.getElementById('sideDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const links = document.querySelectorAll('.drawer-link');

    if (!hamburger || !drawer || !overlay) {
        console.warn("Main: Sidebar elements not found. Check if HTML is updated.");
        return;
    }

    const toggleMenu = () => {
        const isActive = drawer.classList.toggle('active');
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');

        // Prevent scroll when drawer is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    const closeMenu = () => {
        drawer.classList.remove('active');
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // リンククリック時に閉じる
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

/**
 * スクロール時のフェードインアニメーションを設定
 */
function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.fade-in-up');

    // Intersection Observerの設定
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 要素が表示領域に入ったらアニメーション開始
                entry.target.classList.add('visible');

                // インラインスタイルで opacity: 0 が設定されている場合の対応
                if (entry.target.style.opacity === '0') {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, { threshold: 0.1 }); // 要素の10%が表示されたら発火

    // すべての対象要素を監視
    revealElements.forEach(el => observer.observe(el));
}
