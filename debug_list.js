
import { PAPER_DATA } from './src/scripts/paper-data.js';

console.log("--- Nutrition Papers ---");
let count = 0;
PAPER_DATA.forEach((p) => {
    if (p.category === 'Nutrition') {
        count++;
        console.log(`${count}: [ID ${p.id}] ${p.title}`);
        if (p.id === 81) console.log("   ^^^ This is the one user mentioned");
    }
});
console.log(`Total: ${count}`);
