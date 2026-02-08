
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../image');
const destDir = path.join(__dirname, '../public/menu');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function getExtension(buffer) {
  if (buffer.length < 4) return null;
  
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return '.jpg';
  }
  
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    return '.png';
  }
  
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 && 
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return '.webp';
  }

  return null;
}

const files = fs.readdirSync(sourceDir);
const mapping = {};

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const stats = fs.statSync(sourcePath);
  
  if (stats.isDirectory()) return;

  const buffer = fs.readFileSync(sourcePath);
  let ext = path.extname(file).toLowerCase();
  
  if (!ext || ext === '.') {
    const detectedExt = getExtension(buffer);
    if (detectedExt) {
      ext = detectedExt;
    } else {
      console.warn(`Could not determine extension for ${file}`);
      return;
    }
  }

  // Sanitize filename
  const nameWithoutExt = path.basename(file, path.extname(file));
  const newName = nameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') + ext;
    
  const destPath = path.join(destDir, newName);
  
  fs.copyFileSync(sourcePath, destPath);
  
  // Store mapping: original item name (from file name) -> new web path
  // We assume the file name roughly matches the menu item name
  mapping[nameWithoutExt] = `/menu/${newName}`;
  
  console.log(`Processed: ${file} -> ${newName}`);
});

console.log('--- MAPPING START ---');
console.log(JSON.stringify(mapping, null, 2));
console.log('--- MAPPING END ---');
