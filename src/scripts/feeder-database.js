import { FEEDER_DATA } from '../data/feeder-data.js';

/**
 * 餌データベースを初期化(統合版)
 */
export function initFeederDatabase() {
    console.log("Initializing Feeder Database...");

    const container = document.getElementById('feeder-database-container');
    if (!container) {
        console.error("Feeder Database container not found!");
        return;
    }

    // コンテンツをクリア
    container.innerHTML = '';

    // 全ての参照文献を収集
    const allReferences = new Map();

    // カテゴリーごとにレンダリング
    FEEDER_DATA.forEach(category => {
        const categorySection = document.createElement('div');
        categorySection.className = 'feeder-category';

        // カテゴリータイトル
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'feeder-category-title';
        categoryTitle.textContent = category.categoryInfo.title;
        categorySection.appendChild(categoryTitle);

        // グリッドコンテナ
        const grid = document.createElement('div');
        grid.className = 'feeder-grid';

        // 各アイテムのカードを作成
        category.items.forEach(item => {
            const card = createFeederCard(item);
            grid.appendChild(card);

            // 参照文献を収集
            if (item.info && item.info.references && item.info.references.length > 0) {
                item.info.references.forEach(ref => {
                    if (!allReferences.has(ref.source)) {
                        allReferences.set(ref.source, {
                            source: ref.source,
                            title: ref.title,
                            feeders: [item.name]
                        });
                    } else {
                        const existing = allReferences.get(ref.source);
                        if (!existing.feeders.includes(item.name)) {
                            existing.feeders.push(item.name);
                        }
                    }
                });
            }
        });

        categorySection.appendChild(grid);
        container.appendChild(categorySection);
    });

    // 参照文献セクションを作成
    createReferencesSection(allReferences);

    // 検索機能を初期化
    initFeederSearch();
}

/**
 * 餌カードを作成
 */
function createFeederCard(item) {
    const card = document.createElement('div');
    card.className = 'feeder-card';

    // 検索用のdata属性を追加
    card.dataset.feederName = item.name.toLowerCase();

    // 1. Header Section
    const header = document.createElement('div');
    header.className = 'feeder-header';
    header.innerHTML = `
        <div class="feeder-title-row">
            <span class="feeder-name">${item.name}</span>
            <span class="feeder-icon">${item.icon}</span>
        </div>
        <span class="feeder-sci-name">${item.sciName}</span>
    `;
    card.appendChild(header);

    // 2. Stats Section (if stats exist)
    if (item.stats) {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'feeder-stats';

        // Protein Bar
        if (item.stats.protein && item.stats.protein.val) {
            statsContainer.innerHTML += `
                <div class="stat-row">
                    <div class="stat-label"><span>タンパク質</span><span>${item.stats.protein.val}</span></div>
                    <div class="stat-bar-bg"><div class="stat-bar protein" style="width: ${item.stats.protein.width}"></div></div>
                </div>
            `;
        }

        // Fat Bar
        if (item.stats.fat && item.stats.fat.val) {
            statsContainer.innerHTML += `
                <div class="stat-row">
                    <div class="stat-label"><span>脂質</span><span>${item.stats.fat.val}</span></div>
                    <div class="stat-bar-bg"><div class="stat-bar fat" style="width: ${item.stats.fat.width}"></div></div>
                </div>
            `;
        }

        // Ca:P Ratio Badge
        if (item.stats.cap && item.stats.cap.val) {
            statsContainer.innerHTML += `
                <div class="cap-ratio-box ${item.stats.cap.class}">
                    <span>${item.stats.cap.label}</span>
                    <strong>${item.stats.cap.val}</strong>
                </div>
            `;
        }

        card.appendChild(statsContainer);
    }

    // 3. Info Section
    const infoSection = document.createElement('div');
    infoSection.className = 'feeder-info';

    // Insight
    if (item.info && item.info.insight) {
        const insightP = document.createElement('p');
        insightP.className = 'expert-insight';
        insightP.innerHTML = item.info.insight; // HTMLを許可
        infoSection.appendChild(insightP);
    }

    // Note
    if (item.info && item.info.note) {
        const noteP = document.createElement('p');
        noteP.className = 'academic-note';
        noteP.textContent = item.info.note;
        infoSection.appendChild(noteP);
    }

    card.appendChild(infoSection);

    return card;
}

/**
 * 餌検索機能を初期化
 */
function initFeederSearch() {
    const searchInput = document.getElementById('feederSearchInput');
    const searchResultCount = document.getElementById('feederSearchResultCount');

    if (!searchInput || !searchResultCount) return;

    let firstMatchCard = null;

    // 検索処理(ハイライトのみ)
    const performSearch = (shouldScroll = false) => {
        const query = searchInput.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.feeder-card');
        const allCategories = document.querySelectorAll('.feeder-category');

        if (query.length === 0) {
            // 検索クリア: 全て表示、ハイライト解除
            allCards.forEach(card => {
                card.classList.remove('search-highlight');
            });
            allCategories.forEach(cat => cat.style.display = 'block');
            searchResultCount.style.display = 'none';
            firstMatchCard = null;
            return;
        }

        // 検索実行
        let matchCount = 0;
        firstMatchCard = null;

        // 全てのカテゴリーを表示
        allCategories.forEach(cat => cat.style.display = 'block');

        // 全てのカードをチェック
        allCards.forEach(card => {
            const feederName = card.dataset.feederName || '';

            if (feederName.includes(query)) {
                // 該当カード: ハイライト表示
                card.classList.add('search-highlight');
                matchCount++;

                // 最初の該当カードを記録
                if (!firstMatchCard) {
                    firstMatchCard = card;
                }
            } else {
                // 非該当カード: 通常表示(ハイライト解除)
                card.classList.remove('search-highlight');
            }
        });

        // 結果表示
        if (matchCount > 0) {
            searchResultCount.textContent = `${matchCount}件の餌が見つかりました (Enterでスクロール)`;
            searchResultCount.style.display = 'block';

            // Enterキー押下時のみスクロール
            if (shouldScroll && firstMatchCard) {
                firstMatchCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        } else {
            searchResultCount.textContent = '該当する餌が見つかりませんでした';
            searchResultCount.style.display = 'block';
        }
    };

    // 入力時: ハイライトのみ
    searchInput.addEventListener('input', () => {
        performSearch(false);
    });

    // Enterキー押下時: スクロール実行
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(true);
        }
    });
}

/**
 * 参照文献セクションを作成
 */
function createReferencesSection(referencesMap) {
    const referencesContainer = document.getElementById('references-section');
    const accordionContainer = document.getElementById('references-accordion-container');

    if (!referencesContainer || !accordionContainer) {
        console.warn("References section container not found!");
        return;
    }

    if (referencesMap.size === 0) {
        return;
    }

    // 参照文献をソート(年降順)
    const sortedRefs = Array.from(referencesMap.values()).sort((a, b) => {
        const yearA = a.source.match(/(\d{4})/)?.[1] || '0';
        const yearB = b.source.match(/(\d{4})/)?.[1] || '0';
        return yearB.localeCompare(yearA);
    });

    // 年代別にグループ化
    const groupedByDecade = {};
    sortedRefs.forEach(ref => {
        const yearMatch = ref.source.match(/(\d{4})/);
        const year = yearMatch ? parseInt(yearMatch[1]) : 0;
        const decade = year > 0 ? `${Math.floor(year / 10) * 10}年代` : 'その他';

        if (!groupedByDecade[decade]) {
            groupedByDecade[decade] = [];
        }
        groupedByDecade[decade].push(ref);
    });

    // タイトルと説明文
    let titleHtml = '<h3 class="references-title">参考文献 <span class="hero-sub" style="font-size: 0.5em; color: #888;">REFERENCES</span></h3>';
    titleHtml += '<p class="references-subtitle">このデータベースは以下の学術論文と研究に基づいています</p>';
    referencesContainer.innerHTML = titleHtml;

    // アコーディオン
    let accordionHtml = '<div class="references-accordion">';

    for (const [decade, refs] of Object.entries(groupedByDecade)) {
        accordionHtml += `
            <div class="ref-group">
                <button class="ref-group-header">
                    <span class="ref-group-title">${decade}</span>
                    <span class="ref-group-count">${refs.length}件</span>
                    <span class="ref-group-toggle">+</span>
                </button>
                <div class="ref-group-content">
                    <div class="references-grid">
        `;

        refs.forEach(ref => {
            const feedersList = ref.feeders.join('、');
            const yearMatch = ref.source.match(/(\d{4})/);
            const year = yearMatch ? yearMatch[1] : '';
            const author = ref.source.replace(/,?\s*\d{4}.*$/, '');

            accordionHtml += `
                <div class="paper-card" data-year="${year}" data-author="${author.toLowerCase()}" data-title="${ref.title.toLowerCase()}" data-feeders="${feedersList.toLowerCase()}">
                    ${year ? `<div class="paper-meta"><span class="paper-year">${year}</span></div>` : ''}
                    <h4 class="paper-title">${ref.title}</h4>
                    ${author ? `<div class="paper-author">${author}</div>` : ''}
                    <p class="paper-summary">使用データ: ${feedersList}</p>
                </div>
            `;
        });

        accordionHtml += `
                    </div>
                </div>
            </div>
        `;
    }

    accordionHtml += '</div>';
    accordionContainer.innerHTML = accordionHtml;

    // アコーディオン機能を初期化
    initReferencesAccordion();

    // 検索機能を初期化
    initReferencesSearch();
}

/**
 * アコーディオン機能を初期化
 */
function initReferencesAccordion() {
    const headers = document.querySelectorAll('.ref-group-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const group = header.parentElement;
            group.classList.toggle('expanded');
        });
    });

    // 最初のグループを自動展開
    const firstGroup = document.querySelector('.ref-group');
    if (firstGroup) {
        firstGroup.classList.add('expanded');
    }
}

/**
 * 参照文献検索機能を初期化
 */
function initReferencesSearch() {
    const searchInput = document.getElementById('referencesSearchInput');
    const searchResultCount = document.getElementById('referencesSearchResultCount');

    if (!searchInput || !searchResultCount) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.paper-card');
        const allGroups = document.querySelectorAll('.ref-group');

        if (query.length === 0) {
            // 検索クリア
            allCards.forEach(card => card.style.display = 'block');
            allGroups.forEach(group => {
                group.style.display = 'block';
                group.classList.remove('expanded');
            });
            const firstGroup = document.querySelector('.ref-group');
            if (firstGroup) firstGroup.classList.add('expanded');

            searchResultCount.style.display = 'none';
            return;
        }

        // 検索実行
        let matchCount = 0;

        allGroups.forEach(group => {
            const cards = group.querySelectorAll('.paper-card');
            let groupHasMatch = false;

            cards.forEach(card => {
                const year = card.dataset.year || '';
                const author = card.dataset.author || '';
                const title = card.dataset.title || '';
                const feeders = card.dataset.feeders || '';

                const matches = year.includes(query) ||
                    author.includes(query) ||
                    title.includes(query) ||
                    feeders.includes(query);

                if (matches) {
                    card.style.display = 'block';
                    matchCount++;
                    groupHasMatch = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (groupHasMatch) {
                group.style.display = 'block';
                group.classList.add('expanded');
            } else {
                group.style.display = 'none';
            }
        });

        // 結果表示
        if (matchCount > 0) {
            searchResultCount.textContent = `${matchCount}件の論文が見つかりました`;
            searchResultCount.style.display = 'block';
        } else {
            searchResultCount.textContent = '該当する論文が見つかりませんでした';
            searchResultCount.style.display = 'block';
        }
    });
}
