
import { PAPER_DATA } from './src/scripts/paper-data.js';

let count = 0;
let id81Index = -1;

PAPER_DATA.forEach((p, index) => {
    if (p.category === 'Nutrition') {
        count++;
        if (p.id === 81) {
            id81Index = count;
        }
    }
});

console.log(`Total Nutrition papers: ${count}`);
console.log(`ID 81 is the ${id81Index}th Nutrition paper.`);
