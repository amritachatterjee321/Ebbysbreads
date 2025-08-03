import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SVG file
const svgPath = path.join(__dirname, '../public/og-image.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Create a simple HTML file that will render the SVG
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SVG to PNG Converter</title>
    <style>
        body { margin: 0; padding: 0; }
        svg { width: 1200px; height: 630px; }
    </style>
</head>
<body>
    ${svgContent}
</body>
</html>
`;

// Write the HTML file
const htmlPath = path.join(__dirname, '../public/og-image.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('SVG converted to HTML for manual PNG conversion');
console.log('Please open public/og-image.html in a browser and take a screenshot at 1200x630px');
console.log('Save the screenshot as public/og-image.png'); 