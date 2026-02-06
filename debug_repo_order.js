
import { PAPER_DATA } from './src/scripts/paper-data.js';
import { SPECIES_DATA } from './src/scripts/species-data.js';
import { CARE_DATA } from './src/scripts/care-data.js';

// Logic copied/adapted from academic-repository.js
const integratedPaperData = [...PAPER_DATA];
const uniqueTitles = new Set(PAPER_DATA.map(p => p.title.toLowerCase()));

const categoryMapping = {
    'Nutrition': 'nutrition',
    'Nutrition / Husbandry': 'nutrition',
    'Nutrition / Science': 'nutrition',
    'Nutrition / Veterinary': 'nutrition',
    // ... others relevant to nutrition
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

    // 1. From Species Data
    for (const [key, data] of Object.entries(SPECIES_DATA)) {
        if (data.evidence && data.evidence.references) {
            let category = "Science / Biology";
            if (key === 'reptiles') category = "Husbandry / Biology";
            processRefs(data.evidence.references, category, data.evidence.summary);
        }
    }

    // 2. From Care Data
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

// Emulate extraction for 'nutrition' group
const nutritionPapers = [];

// Group by sub-categories first as in the main code
const categorizedPapers = {};
integratedPaperData.forEach(paper => {
    const category = paper.category || 'Others';
    if (!categorizedPapers[category]) {
        categorizedPapers[category] = [];
    }
    categorizedPapers[category].push(paper);
});

console.log("--- Nutrition Group Papers (Order of rendering) ---");
let ordinal = 0;

// The main code iterates through categorizedPapers and assigns to conceptualGroups.
// BUT, the iteration order of `categorizedPapers` keys isn't guaranteed if simply iterating object keys, 
// though typically insertion order or alpha.
// The code does:
// for (const [category, papers] of Object.entries(categorizedPapers)) {
//    const groupKey = categoryMapping[category] || 'others';
//    ...
// }
// And then renders:
// for (const [category, papers] of Object.entries(categories)) { ... }

// So we need to emulate the conceptualGroup structure
const conceptualGroupCategories = {};

for (const [category, papers] of Object.entries(categorizedPapers)) {
    const groupKey = categoryMapping[category] || 'others';
    if (groupKey === 'nutrition') {
        conceptualGroupCategories[category] = papers;
    }
}

// Now iterate through the nutrition group categories
for (const [category, papers] of Object.entries(conceptualGroupCategories)) {
    console.log(`\nCategory: ${category}`);
    papers.forEach(p => {
        ordinal++;
        console.log(`${ordinal}. [${p.id}] ${p.title} (Length: ${p.summary ? p.summary.length : 'N/A'})`);
        if (ordinal >= 26 && ordinal <= 30) {
            console.log(`   FULL SUMMARY: ${p.summary}`);
        }
    });
}
