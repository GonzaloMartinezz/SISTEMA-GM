const fs = require('fs');
const path = require('path');

const dir = './src/modules';

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

let modified = 0;

walkSync(dir, function(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Tailwind classes
    content = content.replace(/text-\[#3D3225\]/g, 'text-[var(--gm-texto)]');
    content = content.replace(/text-\[#B0A697\]/g, 'text-[var(--gm-texto-medio)]');
    content = content.replace(/text-\[#C6BCAC\]/g, 'text-[var(--gm-texto-suave)]');
    
    content = content.replace(/border-\[#E8E0D5\]/g, 'border-[var(--gm-borde)]');
    content = content.replace(/border-\[#F0EAE1\]/g, 'border-[var(--gm-borde-fuerte)]');
    content = content.replace(/border-\[#F4EFE7\]/g, 'border-[var(--gm-divisor)]');

    content = content.replace(/divide-\[#E8E0D5\]/g, 'divide-[var(--gm-borde)]');
    content = content.replace(/divide-\[#F0EAE1\]/g, 'divide-[var(--gm-borde-fuerte)]');
    content = content.replace(/divide-\[#F4EFE7\]/g, 'divide-[var(--gm-divisor)]');

    content = content.replace(/bg-\[#F4EFE7\]/g, 'bg-[var(--gm-superficie-suave)]');
    content = content.replace(/bg-\[#F0EAE1\]/g, 'bg-[var(--gm-superficie-fuerte)]');
    content = content.replace(/bg-\[#E8E0D5\]/g, 'bg-[var(--gm-borde)]');
    content = content.replace(/bg-\[#FFFFFF\]/g, 'bg-[var(--gm-superficie)]');

    // Inline styles (case-insensitive for hex just in case)
    content = content.replace(/'#3D3225'/gi, "'var(--gm-texto)'");
    content = content.replace(/'#B0A697'/gi, "'var(--gm-texto-medio)'");
    content = content.replace(/'#C6BCAC'/gi, "'var(--gm-texto-suave)'");
    content = content.replace(/'#E8E0D5'/gi, "'var(--gm-borde)'");
    content = content.replace(/'#F0EAE1'/gi, "'var(--gm-borde-fuerte)'");
    content = content.replace(/'#F4EFE7'/gi, "'var(--gm-divisor)'");

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        modified++;
    }
});

console.log('Modified ' + modified + ' files.');
