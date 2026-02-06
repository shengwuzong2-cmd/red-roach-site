
const categories = [];
categories['Nutrition'] = ['paper1'];
categories['Veterinary'] = ['paper2'];

console.log("Object.entries output:");
for (const [key, val] of Object.entries(categories)) {
    console.log(key, val);
}

console.log("For..in output:");
for (const key in categories) {
    console.log(key, categories[key]);
}
