// Q&A Renderer for Guide Page
import { GUIDE_QA_CATEGORIES } from './guide-qa-data.js';

// Render all Q&A categories
export function renderGuideQACategories() {
    const container = document.getElementById('guideQaCategoriesContainer');
    if (!container) return;

    container.innerHTML = '';

    GUIDE_QA_CATEGORIES.forEach((category) => {
        const categoryEl = createGuideCategoryElement(category);
        container.appendChild(categoryEl);
    });

    // Initialize event listeners
    initGuideCategoryToggles();
    initGuideAccordions();
}

// Create category element
function createGuideCategoryElement(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'qa-category';
    categoryDiv.dataset.categoryId = category.id;

    // Category header
    const header = document.createElement('button');
    header.className = 'category-header';
    header.innerHTML = `
        <span class="category-icon">${category.icon}</span>
        <span class="qa-category-title">${category.title}</span>
        <span class="category-count">(${category.questions.length}問)</span>
        <span class="category-toggle">▼</span>
    `;

    // Category content
    const content = document.createElement('div');
    content.className = 'category-content';

    // All questions (no "show more" needed for small number of questions)
    const questionsDiv = document.createElement('div');
    questionsDiv.className = 'priority-questions';
    category.questions.forEach(q => {
        questionsDiv.appendChild(createGuideQuestionElement(q));
    });
    content.appendChild(questionsDiv);

    categoryDiv.appendChild(header);
    categoryDiv.appendChild(content);

    return categoryDiv;
}

// Create question element
function createGuideQuestionElement(question) {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const header = document.createElement('button');
    header.className = 'accordion-header';
    header.innerHTML = `
        <span class="q-mark">Q.</span>
        ${question.question}
        <span class="acc-icon">+</span>
    `;

    const content = document.createElement('div');
    content.className = 'accordion-content';

    const answerBox = document.createElement('div');
    answerBox.className = 'answer-box';
    answerBox.innerHTML = question.answer;

    content.appendChild(answerBox);
    item.appendChild(header);
    item.appendChild(content);

    return item;
}

// Initialize category toggles
function initGuideCategoryToggles() {
    const headers = document.querySelectorAll('.category-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.classList.contains('open');

            if (isOpen) {
                header.classList.remove('open');
                content.classList.remove('open');
            } else {
                header.classList.add('open');
                content.classList.add('open');
            }
        });
    });
}

// Initialize accordions
function initGuideAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        // Skip category headers
        if (header.classList.contains('category-header')) return;

        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');

            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Search functionality
export function initGuideQASearch() {
    const searchInput = document.getElementById('guideQaSearchInput');
    const resultCount = document.getElementById('guideSearchResultCount');
    const noResults = document.getElementById('guideNoResultsMessage');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase().trim();

        if (keyword === '') {
            // Reset: show all categories
            document.querySelectorAll('.qa-category').forEach(cat => {
                cat.style.display = 'block';
            });
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.style.display = 'block';
                // Remove highlights
                const header = item.querySelector('.accordion-header');
                header.innerHTML = header.innerHTML.replace(/<mark class="search-highlight">(.*?)<\/mark>/g, '$1');
            });
            if (resultCount) resultCount.style.display = 'none';
            if (noResults) noResults.style.display = 'none';
            return;
        }

        let totalMatches = 0;

        document.querySelectorAll('.qa-category').forEach(category => {
            const questions = category.querySelectorAll('.accordion-item');
            let categoryMatches = 0;

            questions.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');
                const questionText = header.textContent.toLowerCase();
                const answerText = content.textContent.toLowerCase();

                if (questionText.includes(keyword) || answerText.includes(keyword)) {
                    item.style.display = 'block';
                    categoryMatches++;
                    totalMatches++;

                    // Highlight keyword in question
                    const originalText = header.innerHTML;
                    const regex = new RegExp(`(${keyword})`, 'gi');
                    header.innerHTML = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
                } else {
                    item.style.display = 'none';
                }
            });

            // Hide category if no matches
            if (categoryMatches === 0) {
                category.style.display = 'none';
            } else {
                category.style.display = 'block';
                // Auto-open category with matches
                const categoryHeader = category.querySelector('.category-header');
                const categoryContent = category.querySelector('.category-content');
                categoryHeader.classList.add('open');
                categoryContent.classList.add('open');
            }
        });

        // Show result count
        if (totalMatches > 0) {
            if (resultCount) {
                resultCount.textContent = `${totalMatches}件の質問が見つかりました`;
                resultCount.style.display = 'block';
            }
            if (noResults) noResults.style.display = 'none';
        } else {
            if (resultCount) resultCount.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        }
    });
}

// Initialize on page load
export function initGuideQASection() {
    renderGuideQACategories();
    initGuideQASearch();
}
