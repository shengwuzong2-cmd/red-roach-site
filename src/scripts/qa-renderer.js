// Q&A Renderer for Consultation Page
import { QA_CATEGORIES, BADGE_LABELS } from './qa-data.js';

// Render all Q&A categories
export function renderQACategories() {
    const container = document.getElementById('qaCategoriesContainer');
    if (!container) return;

    container.innerHTML = '';

    QA_CATEGORIES.forEach((category, categoryIndex) => {
        const categoryEl = createCategoryElement(category, categoryIndex);
        container.appendChild(categoryEl);
    });

    // Initialize event listeners
    initCategoryToggles();
    initShowMoreButtons();
    initAccordions();
}

// Create category element
function createCategoryElement(category, categoryIndex) {
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

    // Priority questions (first 3)
    const priorityDiv = document.createElement('div');
    priorityDiv.className = 'priority-questions';
    category.questions.slice(0, 3).forEach(q => {
        priorityDiv.appendChild(createQuestionElement(q));
    });
    content.appendChild(priorityDiv);

    // More questions (remaining)
    if (category.questions.length > 3) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'more-questions';
        category.questions.slice(3).forEach(q => {
            moreDiv.appendChild(createQuestionElement(q));
        });
        content.appendChild(moreDiv);

        // Show more button
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'show-more-btn';
        showMoreBtn.dataset.moreCount = category.questions.length - 3;
        showMoreBtn.textContent = `さらに${category.questions.length - 3}問を表示`;
        content.appendChild(showMoreBtn);
    }

    categoryDiv.appendChild(header);
    categoryDiv.appendChild(content);

    return categoryDiv;
}

// Create question element
function createQuestionElement(question) {
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

    question.answers.forEach(answer => {
        const answerRow = document.createElement('div');
        answerRow.className = 'answer-row';
        answerRow.innerHTML = `
            <span class="role-badge ${answer.badge}">${BADGE_LABELS[answer.badge]}</span>
            <p>${answer.text}</p>
        `;
        answerBox.appendChild(answerRow);
    });

    content.appendChild(answerBox);
    item.appendChild(header);
    item.appendChild(content);

    return item;
}

// Initialize category toggles
function initCategoryToggles() {
    const headers = document.querySelectorAll('.category-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = content.classList.contains('expanded');

            if (isExpanded) {
                content.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
            }
        });
    });
}

// Initialize show more buttons
function initShowMoreButtons() {
    const buttons = document.querySelectorAll('.show-more-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const moreQuestions = btn.previousElementSibling;
            const isVisible = moreQuestions.classList.contains('visible');
            const count = btn.dataset.moreCount;

            if (isVisible) {
                moreQuestions.classList.remove('visible');
                btn.textContent = `さらに${count}問を表示`;
            } else {
                moreQuestions.classList.add('visible');
                btn.textContent = '折りたたむ';
            }
        });
    });
}

// Initialize accordions
function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        // Skip category headers
        if (header.classList.contains('category-header')) return;

        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = content.classList.contains('expanded');

            if (isExpanded) {
                content.classList.remove('expanded');
            } else {
                content.classList.add('expanded');
            }
        });
    });
}

// Search functionality
export function initQASearch() {
    const searchInput = document.getElementById('qaSearchInput');
    const resultCount = document.getElementById('searchResultCount');
    const noResults = document.getElementById('noResultsMessage');
    const container = document.getElementById('qaCategoriesContainer');

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
            resultCount.style.display = 'none';
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
                const categoryContent = category.querySelector('.category-content');
                categoryContent.classList.add('expanded');
            }
        });

        // Show result count
        if (totalMatches > 0) {
            resultCount.textContent = `${totalMatches}件の質問が見つかりました`;
            resultCount.style.display = 'block';
            if (noResults) noResults.style.display = 'none';
        } else {
            resultCount.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
        }
    });
}

// Initialize on page load
export function initQASection() {
    renderQACategories();
    initQASearch();
}
