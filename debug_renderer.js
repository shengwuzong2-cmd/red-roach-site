
import { PAPER_DATA } from './src/scripts/paper-data.js';
import { SPECIES_DATA } from './src/scripts/species-data.js';
import { CARE_DATA } from './src/scripts/care-data.js';

// --- Logic from academic-repository.js ---
const integratedPaperData = [...PAPER_DATA];
const uniqueTitles = new Set(PAPER_DATA.map(p => p.title.toLowerCase()));

// MERGE LOGIC
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

for (const [key, data] of Object.entries(SPECIES_DATA)) {
    if (data.evidence && data.evidence.references) {
        let category = "Science / Biology";
        if (key === 'reptiles') category = "Husbandry / Biology";
        if (key === 'arthropods') category = "Arthropodology";
        processRefs(data.evidence.references, category, data.evidence.summary);
    }
}

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
// --- End Merge Logic ---

// --- Rendering Logic Simulation ---
const categorizedPapers = {};
integratedPaperData.forEach(paper => {
    const category = paper.category || 'Others';
    if (!categorizedPapers[category]) categorizedPapers[category] = [];
    categorizedPapers[category].push(paper);
});

// We only care about 'Nutrition' category for this reproduction
const papers = categorizedPapers['Nutrition'];
console.log(`Total Nutrition papers: ${papers.length}`);

// Generate HTML logic
function generateJapaneseTitle(paper) {
    if (!paper.summary) return paper.title;
    const summary = paper.summary;
    const sentences = summary.split('。');
    let title = sentences[0];
    if (title.length <= 20 && sentences.length > 1 && sentences[1].trim().length > 0) {
        title += '。' + sentences[1];
    }
    if (title.length > 100) {
        return title.substring(0, 97) + '...';
    }
    return title;
}

try {
    let index = 0;
    papers.forEach(paper => {
        index++;
        console.log(`Rendering item ${index}: [${paper.id}]`);

        const titleJa = generateJapaneseTitle(paper);
        // Emulate HTML construction
        const html = `
            <h4>${titleJa}</h4>
            <p>${paper.summary}</p>
        `;
        // success
    });
    console.log("Renderer finished successfully.");
} catch (e) {
    console.error("Renderer crashed!", e);
}
