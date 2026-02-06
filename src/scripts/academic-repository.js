import { PAPER_DATA } from './paper-data.js';
import { SPECIES_DATA } from './species-data.js';
import { CARE_DATA } from './care-data.js';

/**
 * Initialize Paper Repository
 * Loads the HTML component and initializes the logic.
 * With 2-level categorization, accordion UI, and search functionality
 */
export async function initAcademicRepository(containerId = 'academicRepositoryContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    // Load HTML component
    try {
        const response = await fetch('/src/components/academic-repository.html');
        if (!response.ok) throw new Error(`Failed to load component: ${response.statusText}`);
        const html = await response.text();
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading Academic Repository component:', error);
        container.innerHTML = '<p class="error">コンテンツの読み込みに失敗しました。</p>';
        return;
    }

    const repoGrid = document.getElementById('paperRepository');
    const searchInput = document.getElementById('repoSearchInput');
    const searchResultCount = document.getElementById('repoSearchResultCount');

    if (!repoGrid) return;

    // 概念的グループ定義(大分類)
    const conceptualGroups = {
        'nutrition': { name: '栄養学', icon: '🥗', categories: {} },
        'veterinary': { name: '獣医学', icon: '⚕️', categories: {} },
        'husbandry': { name: '飼育学', icon: '🏠', categories: {} },
        'science': { name: '科学', icon: '🔬', categories: {} },
        'environment': { name: '環境学', icon: '🌿', categories: {} },
        'biology': { name: '生物学', icon: '📚', categories: {} },
        'others': { name: 'その他', icon: '📄', categories: {} }
    };

    // カテゴリー定義(小分類)と概念的グループへのマッピング
    const categoryMapping = {
        'Nutrition': 'nutrition',
        'Nutrition / Husbandry': 'nutrition',
        'Nutrition / Science': 'nutrition',
        'Nutrition / Veterinary': 'nutrition',
        'Veterinary': 'veterinary',
        'Veterinary / Nutrition': 'veterinary',
        'Veterinary / Environment': 'veterinary',
        'Veterinary / Reference': 'veterinary',
        'Science / Veterinary': 'veterinary',
        'Husbandry': 'husbandry',
        'Husbandry / Biology': 'husbandry',
        'Husbandry / Pest Control': 'husbandry',
        'Husbandry / Enrichment': 'husbandry',
        'Husbandry / Education': 'husbandry',
        'Husbandry / Science': 'husbandry',
        'Husbandry / Nutrition': 'husbandry',
        'Husbandry / Comprehensive': 'husbandry',
        'Science': 'science',
        'Science / Biology': 'science',
        'Science / Taxonomy': 'science',
        'Science / Nutrition': 'science',
        'Science / Economy': 'science',
        'Science / Husbandry': 'science',
        'Science / Environment': 'science',
        'Environment': 'environment',
        'Environment / Science': 'environment',
        'Environment / Biology': 'environment',
        'Biology / Reference': 'biology',
        'Arthropodology': 'biology',
        'Education / Husbandry': 'husbandry'
    };

    // BibliographyデータをPaperData形式に変換・統合
    const integratedPaperData = [...PAPER_DATA];
    const uniqueTitles = new Set(PAPER_DATA.map(p => p.title.toLowerCase()));

    function mergeBibliographyData() {
        // Helper to process refs
        const processRefs = (refs, defaultCategory, summary) => {
            refs.forEach(ref => {
                // 重複チェック
                if (uniqueTitles.has(ref.title.toLowerCase())) return;
                uniqueTitles.add(ref.title.toLowerCase());

                // タイトルから著者と年を抽出 (例: "Title (Author, 2020)")
                let title = ref.title;
                let author = "Unknown Author";
                let year = "Unknown Year";

                const match = title.match(/(.*)\s\((.+),\s(\d{4})\)$/);
                if (match) {
                    title = match[1];
                    author = match[2];
                    year = match[3];
                }

                integratedPaperData.push({
                    id: `bib-${integratedPaperData.length + 1}`,
                    title: title,
                    author: author,
                    year: year,
                    summary: summary || "No summary available.",
                    category: defaultCategory,
                    url: ref.url
                });
            });
        };

        // 1. From Species Data
        for (const [key, data] of Object.entries(SPECIES_DATA)) {
            if (data.evidence && data.evidence.references) {
                // Determine Category based on key
                let category = "Science / Biology";
                if (key === 'reptiles') category = "Husbandry / Biology";
                if (key === 'arthropods') category = "Arthropodology";

                processRefs(data.evidence.references, category, data.evidence.summary);
            }
        }

        // 2. From Care Data
        for (const [key, data] of Object.entries(CARE_DATA)) {
            if (data.insights) {
                // Determine Category based on key
                let category = "Others";
                if (key === 'nutrition') category = "Nutrition";
                if (key === 'health') category = "Veterinary";
                if (key === 'environment') category = "Environment";

                data.insights.forEach(insight => {
                    if (insight.refs) processRefs(insight.refs, category, insight.summary);
                });
            }
        }
    }

    // マージ実行
    mergeBibliographyData();

    // カテゴリー別に論文を分類 (integratedPaperDataを使用)
    const categorizedPapers = {};
    integratedPaperData.forEach(paper => {
        const category = paper.category || 'Others';
        if (!categorizedPapers[category]) {
            categorizedPapers[category] = [];
        }
        categorizedPapers[category].push(paper);
    });

    // 概念的グループごとにカテゴリーを整理
    for (const [category, papers] of Object.entries(categorizedPapers)) {
        const groupKey = categoryMapping[category] || 'others';
        if (!conceptualGroups[groupKey].categories[category]) {
            conceptualGroups[groupKey].categories[category] = [];
        }
        conceptualGroups[groupKey].categories[category] = papers;
    }

    // 2段階アコーディオンUIを生成
    function renderGroups(filteredData = null) {
        repoGrid.innerHTML = '';
        const dataToRender = filteredData || conceptualGroups;

        let totalCount = 0;

        for (const [groupKey, group] of Object.entries(dataToRender)) {
            const categories = group.categories;
            if (!categories || Object.keys(categories).length === 0) continue;

            // グループ内の論文総数を計算
            const groupPaperCount = Object.values(categories).reduce((sum, papers) => sum + papers.length, 0);
            totalCount += groupPaperCount;

            // グループレベルのアコーディオン
            const groupDiv = document.createElement('div');
            groupDiv.className = 'paper-group';

            const groupHeader = document.createElement('button');
            groupHeader.className = 'paper-group-header';
            groupHeader.innerHTML = `
                <span class="paper-group-icon">${group.icon}</span>
                <span class="paper-group-title">${group.name}</span>
                <span class="paper-group-count">${groupPaperCount}件</span>
                <span class="paper-group-toggle">+</span>
            `;

            const groupContent = document.createElement('div');
            groupContent.className = 'paper-group-content';

            // カテゴリーレベルのアコーディオン
            for (const [category, papers] of Object.entries(categories)) {
                if (!papers || papers.length === 0) continue;

                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'paper-category';

                const categoryHeader = document.createElement('button');
                categoryHeader.className = 'paper-category-header';

                // カテゴリー名を日本語に翻訳
                const categoryNameJa = translateCategoryName(category);

                categoryHeader.innerHTML = `
                    <span class="paper-category-title">${categoryNameJa}</span>
                    <span class="paper-category-count">${papers.length}件</span>
                    <span class="paper-category-toggle">+</span>
                `;

                const categoryContent = document.createElement('div');
                categoryContent.className = 'paper-category-content';

                papers.forEach(paper => {
                    const card = document.createElement('div');
                    card.className = 'paper-card';

                    // summaryから適切な日本語タイトルを生成
                    const titleJa = generateJapaneseTitle(paper);

                    // 著者・年の表示制御 (不明な場合は非表示)
                    const metaHtml = (paper.year && paper.year !== "Unknown Year")
                        ? `<div class="paper-meta"><span class="paper-year">${paper.year}</span></div>`
                        : '';

                    const authorHtml = (paper.author && paper.author !== "Unknown Author")
                        ? `<div class="paper-author">${paper.author}</div>`
                        : '';

                    card.innerHTML = `
                        ${metaHtml}
                        <h4 class="paper-title">${titleJa}</h4>
                        ${authorHtml}
                        <p class="paper-summary">${paper.summary}</p>
                        ${paper.url !== '#' ? `<a href="${paper.url}" target="_blank" class="paper-link">原文を見る →</a>` : ''}
                    `;
                    categoryContent.appendChild(card);
                });

                categoryHeader.addEventListener('click', (e) => {
                    e.stopPropagation();
                    categoryDiv.classList.toggle('expanded');
                });

                categoryDiv.appendChild(categoryHeader);
                categoryDiv.appendChild(categoryContent);
                groupContent.appendChild(categoryDiv);
            }

            groupHeader.addEventListener('click', () => {
                groupDiv.classList.toggle('expanded');
            });

            groupDiv.appendChild(groupHeader);
            groupDiv.appendChild(groupContent);
            repoGrid.appendChild(groupDiv);
        }

        // 結果が0件の場合
        if (totalCount === 0) {
            repoGrid.innerHTML = '<div class="no-results"><p>該当する論文が見つかりませんでした。</p></div>';
        }

        return totalCount;
    }

    // 初期表示
    renderGroups();

    // 検索機能
    if (searchInput && searchResultCount) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length === 0) {
                renderGroups();
                searchResultCount.style.display = 'none';
                return;
            }

            // 検索フィルタリング(2段階構造を維持)
            const filteredGroups = {};
            let totalMatches = 0;

            for (const [groupKey, group] of Object.entries(conceptualGroups)) {
                const filteredCategories = {};

                for (const [category, papers] of Object.entries(group.categories)) {
                    const matches = papers.filter(paper =>
                        paper.title.toLowerCase().includes(query) ||
                        paper.author.toLowerCase().includes(query) ||
                        paper.summary.toLowerCase().includes(query) ||
                        category.toLowerCase().includes(query)
                    );

                    if (matches.length > 0) {
                        filteredCategories[category] = matches;
                        totalMatches += matches.length;
                    }
                }

                if (Object.keys(filteredCategories).length > 0) {
                    filteredGroups[groupKey] = {
                        ...group,
                        categories: filteredCategories
                    };
                }
            }

            const count = renderGroups(filteredGroups);

            // 結果カウント表示
            if (count > 0) {
                searchResultCount.textContent = `${count}件の論文が見つかりました`;
                searchResultCount.style.display = 'block';

                // 検索結果を含むグループとカテゴリーを自動展開
                document.querySelectorAll('.paper-group').forEach(group => {
                    group.classList.add('expanded');
                });
                document.querySelectorAll('.paper-category').forEach(cat => {
                    cat.classList.add('expanded');
                });

                // ハイライト表示
                highlightPaperSearchTerms(query);
            } else {
                searchResultCount.style.display = 'none';
            }
        });
    }

    // ハイライト機能
    function highlightPaperSearchTerms(query) {
        const titles = document.querySelectorAll('.paper-title');
        const authors = document.querySelectorAll('.paper-author');
        const summaries = document.querySelectorAll('.paper-summary');

        const regex = new RegExp(`(${query})`, 'gi');

        titles.forEach(el => {
            const text = el.textContent;
            el.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
        });

        authors.forEach(el => {
            const text = el.textContent;
            el.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
        });

        summaries.forEach(el => {
            const text = el.textContent;
            el.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
        });
    }

    // summaryから適切な日本語タイトルを生成
    function generateJapaneseTitle(paper) {
        // summaryの最初の文(句点まで)を抽出
        const summary = paper.summary;
        const sentences = summary.split('。');

        let title = sentences[0];

        // 最初の文が短すぎる場合(20文字以下)で、かつ次の文がある場合は連結する
        if (title.length <= 20 && sentences.length > 1 && sentences[1].trim().length > 0) {
            title += '。' + sentences[1];
        }

        // 長すぎる場合は短縮
        if (title.length > 100) {
            return title.substring(0, 97) + '...';
        }

        return title;
    }

    // カテゴリー名を日本語に翻訳
    function translateCategoryName(category) {
        const categoryNames = {
            'Nutrition': '栄養学',
            'Nutrition / Husbandry': '栄養学・飼育',
            'Nutrition / Science': '栄養学・科学',
            'Nutrition / Veterinary': '栄養学・獣医学',
            'Veterinary': '獣医学',
            'Veterinary / Nutrition': '獣医学・栄養',
            'Veterinary / Environment': '獣医学・環境',
            'Veterinary / Reference': '獣医学・参考書',
            'Science / Veterinary': '科学・獣医学',
            'Husbandry': '飼育学',
            'Husbandry / Biology': '飼育学・生物学',
            'Husbandry / Pest Control': '飼育学・害虫管理',
            'Husbandry / Enrichment': '飼育学・エンリッチメント',
            'Husbandry / Education': '飼育学・教育',
            'Husbandry / Science': '飼育学・科学',
            'Husbandry / Nutrition': '飼育学・栄養',
            'Husbandry / Comprehensive': '飼育学・包括',
            'Science': '科学',
            'Science / Biology': '科学・生物学',
            'Science / Taxonomy': '科学・分類学',
            'Science / Nutrition': '科学・栄養学',
            'Science / Economy': '科学・経済',
            'Science / Husbandry': '科学・飼育',
            'Science / Environment': '科学・環境',
            'Environment': '環境学',
            'Environment / Science': '環境学・科学',
            'Environment / Biology': '環境学・生物学',
            'Biology / Reference': '生物学・参考書',
            'Arthropodology': '節足動物学',
            'Education / Husbandry': '教育・飼育'
        };

        return categoryNames[category] || category;
    }
}
