
import { PAPER_DATA } from './src/scripts/paper-data.js';
import { SPECIES_DATA } from './src/scripts/species-data.js';
import { CARE_DATA } from './src/scripts/care-data.js';

// Logic copied from academic-repository.js
const integratedPaperData = [...PAPER_DATA];
const uniqueTitles = new Set(PAPER_DATA.map(p => p.title.toLowerCase()));

const categoryMapping = {
    'Nutrition': 'nutrition',
    'Nutrition / Husbandry': 'nutrition',
    'Nutrition / Science': 'nutrition',
    'Nutrition / Veterinary': 'nutrition',
};

function mergeBibliographyData() {
    const processRefs = (refs, defaultCategory, summary) => {
        refs.forEach(ref => {
            if (uniqueTitles.has(ref.title.toLowerCase())) return;
            uniqueTitles.add(ref.title.toLowerCase());

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

    // 1. Species Data
    for (const [key, data] of Object.entries(SPECIES_DATA)) {
        if (data.evidence && data.evidence.references) {
            let category = "Science / Biology";
            if (key === 'reptiles') category = "Husbandry / Biology";
            // if (key === 'arthropods') category = "Arthropodology"; // Mapped to biology

            // NOTE: academic-repository has this logic:
            // if (key === 'arthropods') category = "Arthropodology";
            // And "Arthropodology" maps to 'biology' group

            processRefs(data.evidence.references, category, data.evidence.summary);
        }
    }

    // 2. Care Data
    for (const [key, data] of Object.entries(CARE_DATA)) {
        if (data.insights) {
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

mergeBibliographyData();

const categorizedPapers = {};
integratedPaperData.forEach(paper => {
    const category = paper.category || 'Others';
    if (!categorizedPapers[category]) {
        categorizedPapers[category] = [];
    }
    categorizedPapers[category].push(paper);
});

console.log("--- Nutrition Group Papers (Rendering Order) ---");
let ordinal = 0;

// Need to match iteration order of academic-repository.js which uses Object.entries(group.categories)
// group.categories is constructed by iterating categorizedPapers and mapping key.
// But wait, the categories object in 'conceptualGroups' is populated in insertion order.

const conceptualGroupCategories = {};

for (const [category, papers] of Object.entries(categorizedPapers)) {
    const groupKey = categoryMapping[category] || 'others';
    if (groupKey === 'nutrition') {
        conceptualGroupCategories[category] = papers;
    }
}

for (const [category, papers] of Object.entries(conceptualGroupCategories)) {
    console.log(`\nCategory: ${category}`);
    papers.forEach(p => {
        ordinal++;
        if (ordinal >= 25 && ordinal <= 35) {
            console.log(`${ordinal}. [${p.id}] ${p.title}`);
            if (p.summary) console.log(`    SUMMARY: ${p.summary.substring(0, 50)}...`);
            if (ordinal === 27) console.log("    ^^^^ THIS IS THE 27th PAPER (Last visible)");
            if (ordinal === 28) console.log("    ^^^^ THIS IS THE 28th PAPER (Problematic?)");
        }
    });
}
