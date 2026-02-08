
const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, '../image-mapping-utf8.json');
const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
let mockData = fs.readFileSync(mockDataPath, 'utf8');

let updatedCount = 0;

for (const [name, newPath] of Object.entries(mapping)) {
    // Regex to find the menu item block with the specific name
    // We look for name: 'Name', capture specifically that block's image property
    // This is a bit tricky with regex, so we'll do a specific replacement pipeline

    // Pattern: name: 'Escape(Name)', ... (lookahead for image:) image: '...'
    // However, JS regex lookbehind/multiline is tricky. 
    // Let's rely on the structure:
    // name: 'Name',
    // description: '...',
    // price: ...,
    // image: '...',

    // We will split by "name: " to find sections, or use a more robust regex.

    // Construct regex: item with this name, update its image field.
    // We assume the image field comes after name and before the next object start or name.

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(name: '${escapedName}',[\\s\\S]*?image: ')([^']+)(')`, 'g');

    if (regex.test(mockData)) {
        mockData = mockData.replace(regex, `$1${newPath}$3`);
        console.log(`Updated image for: ${name}`);
        updatedCount++;
    } else {
        console.warn(`Could not find menu item in mockData for: ${name}`);
    }
}

fs.writeFileSync(mockDataPath, mockData, 'utf8');
console.log(`Total updated items: ${updatedCount}`);
