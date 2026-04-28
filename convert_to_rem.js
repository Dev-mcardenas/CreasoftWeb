const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'style.css');
let css = fs.readFileSync(filePath, 'utf8');

const propsToConvert = [
    'font-size', 'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
    'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'gap'
];

const propRegex = new RegExp(`(${propsToConvert.join('|')}):\\s*([^;}]+)([;}])`, 'g');

css = css.replace(propRegex, (match, prop, value, endChar) => {
    const newValue = value.replace(/(-?\d*\.?\d+)px/g, (pxMatch, p1) => {
        const px = parseFloat(p1);
        if (px === 0) return '0';
        if (Math.abs(px) <= 3) return pxMatch; // Mantener 1px, 2px, 3px para bordes o detalles finos
        
        const rem = px / 16;
        return `${parseFloat(rem.toFixed(4))}rem`;
    });
    return `${prop}: ${newValue}${endChar}`;
});

fs.writeFileSync(filePath, css, 'utf8');
console.log('Conversión de px a rem completada exitosamente.');
