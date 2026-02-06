
import { PAPER_DATA } from './src/scripts/paper-data.js';

const nutritionPapers = PAPER_DATA.filter(p => p.category === 'Nutrition');

let found81 = false;
let nextPaper = null;

for (let i = 0; i < nutritionPapers.length; i++) {
    const p = nutritionPapers[i];
    if (found81) {
        nextPaper = p;
        break;
    }
    if (p.id === 81) {
        found81 = true;
    }
}

if (nextPaper) {
    console.log("Paper after ID 81:");
    console.log(`ID: ${nextPaper.id}`);
    console.log(`Title: ${nextPaper.title}`);
    console.log(`Summary: ${nextPaper.summary}`);
} else {
    console.log("ID 81 is the last Nutrition paper in PAPER_DATA.");
}
