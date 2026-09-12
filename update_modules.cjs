const fs = require('fs');
const path = require('path');

// 1. Update Layouts
const layouts = {
  'Clientes/layout/ClientesLayout.jsx': 1,
  'Equipos/layout/EquiposLayout.jsx': 2,
  'Seguimientos/layout/SeguimientosLayout.jsx': 3,
  'Agenda/layout/AgendaLayout.jsx': 4,
  'Notario/layout/NotarioLayout.jsx': 5,
  'Mapa/layout/MapaLayout.jsx': 6,
  'Cobranzas/layout/CobranzasLayout.jsx': 7,
  'Finanzas/layout/FinanzasLayout.jsx': 9
};

for (const [relPath, num] of Object.entries(layouts)) {
  const fullPath = path.join('src/modules', relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/numero=\{\d+\}/, `numero={${num}}`);
    fs.writeFileSync(fullPath, content);
  }
}

// 2. Global Replacement for M-XX
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

walkSync('./src', function(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We must do this carefully. 
    // We use a temporary token to avoid double replacement.
    content = content.replace(/M-03/g, 'M_TEMP_09');
    content = content.replace(/M-08/g, 'M_TEMP_07');
    content = content.replace(/M-07/g, 'M_TEMP_06');
    content = content.replace(/M-06/g, 'M_TEMP_05');
    content = content.replace(/M-05/g, 'M_TEMP_04');
    content = content.replace(/M-04/g, 'M_TEMP_03');

    content = content.replace(/M_TEMP_/g, 'M-');

    if (content !== original) {
        fs.writeFileSync(filePath, content);
    }
});

// 3. Reorder modules.config.js array
let configContent = fs.readFileSync('src/config/modules.config.js', 'utf8');

// We'll extract each module block and re-insert them in order
const modulesOrder = [
  'clientes',
  'equipamientos',
  'seguimientos',
  'agenda',
  'notario360',
  'logistica',
  'cobranzas',
  'tesoreria'
];

// Instead of complex AST parsing, we just regex extract the blocks.
// They look like: { \n id: 'clientes', ... },
let blocks = [];
for (const id of modulesOrder) {
  const regex = new RegExp(`\\{\\s*id:\\s*'${id}'[\\s\\S]*?\\},`, 'g');
  const match = configContent.match(regex);
  if (match) {
    blocks.push(match[0]);
  }
}

const arrayInner = blocks.join('\\n  ');
configContent = configContent.replace(/export const MODULES = \\[[\\s\\S]*?\\];/, `export const MODULES = [\\n  ${arrayInner}\\n];`);

fs.writeFileSync('src/config/modules.config.js', configContent);

console.log('Update complete.');
