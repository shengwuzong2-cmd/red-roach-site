/**
 * Consultation Room Logic
 * Handles Accordion, Form Submission, and Academic Evidence (Species & Care)
 */

import { SPECIES_DATA } from './species-data.js';
import { CARE_DATA } from './care-data.js';

// renderQA logic is replaced by static HTML in consultation.html

document.addEventListener('DOMContentLoaded', () => {
    // renderQA('qaContainer'); // Render Q&A from data (Now static)
    initAccordion();
    initConsultForm();
    initSpeciesAutocomplete();

    initCategoryInsights();

});

/**
 * Initialize Accordion behavior
 */
function initAccordion() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });
}

/**
 * Initialize Form Submission behavior
 */
function initConsultForm() {
    const form = document.getElementById('consultForm');
    const successMsg = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    if (!form || !successMsg || !resetBtn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Fade out form
        form.style.opacity = '0';

        setTimeout(() => {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            void successMsg.offsetWidth;
            successMsg.style.opacity = '1';
            successMsg.classList.add('visible');
        }, 300);
    });

    resetBtn.addEventListener('click', () => {
        successMsg.style.opacity = '0';
        successMsg.classList.remove('visible');

        setTimeout(() => {
            successMsg.style.display = 'none';
            form.style.display = 'block';
            void form.offsetWidth;
            form.style.opacity = '1';
            form.reset();
        }, 300);
    });
}

/**
 * Initialize Species Autocomplete & Evidence Display
 */
function initSpeciesAutocomplete() {
    const input = document.getElementById('targetSpeciesInput');
    const suggestionBox = document.getElementById('speciesSuggestions');

    if (!input || !suggestionBox) return;

    // Flatten data for search
    const speciesList = [];
    for (const [key, categoryData] of Object.entries(SPECIES_DATA)) {
        categoryData.groups.forEach(group => {
            group.items.forEach(item => {
                speciesList.push({
                    name: item,
                    categoryName: categoryData.label,
                    evidence: categoryData.evidence, // Link evidence to item
                    groupName: group.name
                });
            });
        });
    }

    // Input Handler
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();

        if (query.length < 1) {
            suggestionBox.style.display = 'none';
            return;
        }

        const matches = speciesList.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.groupName.toLowerCase().includes(query)
        );

        renderSuggestions(matches);
    });

    // Render Dropdown
    function renderSuggestions(matches) {
        suggestionBox.innerHTML = '';
        if (matches.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        matches.forEach(match => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `<span class="suggestion-category">${match.categoryName}</span> ${match.name}`;

            div.addEventListener('click', () => {
                selectSpecies(match);
            });

            suggestionBox.appendChild(div);
        });

        suggestionBox.style.display = 'block';
    }

    // Handle Selection
    function selectSpecies(match) {
        input.value = match.name;
        suggestionBox.style.display = 'none';

        // Show evidence if available (Species Specific)
        if (match.evidence) {
            renderEvidence(match.evidence.summary, match.evidence.references, "🎓 ACADEMIC INSIGHT (Species)");
        }
    }

    // Hide dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#targetSpeciesInput') && !e.target.closest('#speciesSuggestions')) {
            suggestionBox.style.display = 'none';
        }
    });
}

/**
 * Initialize Category Insights (Environment, Health, Nutrition)
 */
function initCategoryInsights() {
    const radioInputs = document.querySelectorAll('input[name="category"]');

    radioInputs.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const category = e.target.value; // 'health', 'nutrition', 'environment'
            const data = CARE_DATA[category];

            if (data) {
                // Construct summary from insights
                let summaryHTML = "";
                data.insights.forEach(insight => {
                    summaryHTML += `<strong>${insight.topic}:</strong> ${insight.summary}<br><br>`;
                });

                // Add checklist if available
                if (data.checklist) {
                    summaryHTML += `<div class="checklist-box"><strong>✅ Health Checklist:</strong><ul>`;
                    data.checklist.forEach(item => {
                        summaryHTML += `<li>${item}</li>`;
                    });
                    summaryHTML += `</ul></div>`;
                }

                // Collect references
                let allRefs = [];
                data.insights.forEach(insight => {
                    if (insight.refs) allRefs = [...allRefs, ...insight.refs];
                });

                renderEvidence(summaryHTML, allRefs, `🔬 CARE ADVICE: ${data.label}`);
            }
        });
    });
}

/**
 * Helper to Render Evidence Box
 */
function renderEvidence(contentHtml, references, headerTitle) {
    const evidenceDisplay = document.getElementById('evidenceDisplay');
    const evidenceText = document.getElementById('evidenceText');
    const evidenceRefs = document.getElementById('evidenceRefs');
    const evidenceHeader = evidenceDisplay.querySelector('.evidence-header');

    if (!evidenceDisplay) return;

    // Update Header
    if (evidenceHeader) evidenceHeader.innerHTML = `<span class="evidence-icon">🎓</span> ${headerTitle}`;

    // Update Content
    evidenceText.innerHTML = contentHtml;

    // Update Refs
    evidenceRefs.innerHTML = '';
    if (references && references.length > 0) {
        references.forEach(ref => {
            const link = document.createElement('a');
            link.className = 'ref-link';
            link.href = ref.url !== '#' ? ref.url : 'javascript:void(0)';
            link.target = ref.url !== '#' ? '_blank' : '';
            link.textContent = `• ${ref.title}`;
            evidenceRefs.appendChild(link);
        });
    }

    evidenceDisplay.style.display = 'block';

    // Animate
    evidenceDisplay.classList.remove('fade-in');
    void evidenceDisplay.offsetWidth; // trigger reflow
    evidenceDisplay.classList.add('fade-in');
}




