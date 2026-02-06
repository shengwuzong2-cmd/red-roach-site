
import { PAPER_DATA } from './src/scripts/paper-data.js';

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

const conceptualGroups = {
    'nutrition': { name: '栄養学', categories: {} }
};

const categorizedPapers = {};
PAPER_DATA.forEach(paper => {
    const category = paper.category || 'Others';
    if (!categorizedPapers[category]) categorizedPapers[category] = [];
    categorizedPapers[category].push(paper);
});

// Emulate population
for (const [category, papers] of Object.entries(categorizedPapers)) {
    const groupKey = categoryMapping[category] || 'others';
    if (conceptualGroups[groupKey]) {
        console.log(`Adding category '${category}' to group '${groupKey}' with ${papers.length} papers`);
        conceptualGroups[groupKey].categories[category] = papers;
    }
}

console.log("\n--- Conceptual Group: Nutrition ---");
const group = conceptualGroups['nutrition'];
const categories = group.categories;

console.log("Keys in categories object:", Object.keys(categories));

for (const [cat, items] of Object.entries(categories)) {
    console.log(`Subcategory: [${cat}] - Items: ${items.length}`);
    items.forEach(p => {
        if (p.id >= 80 && p.id <= 85) {
            console.log(`   - ID ${p.id} (${p.title.substring(0, 20)}...)`);
        }
    });
}
