const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const stores = ['Project', 'Data', 'UI', 'Auth', 'Settings', 'Dialog', 'Toast'];
const regex = new RegExp(`const\\s*\\{\\s*([^}]+?)\\s*\\}\\s*=\\s*use(${stores.join('|')})Store\\(\\s*\\)\\s*;`, 'g');

let modifiedFiles = 0;

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  const newContent = content.replace(regex, (match, varsStr, storeName) => {
    hasChanges = true;
    const vars = varsStr.split(',').map(v => v.trim()).filter(v => v);
    
    // Find the indentation of the original line to match it
    const index = content.indexOf(match);
    let indent = '';
    for (let i = index - 1; i >= 0; i--) {
      if (content[i] === '\n') break;
      if (content[i] === ' ' || content[i] === '\t') indent = content[i] + indent;
      else indent = '';
    }

    return vars.map((v, i) => {
      // Si hay un alias en la destructuración (e.g. { foo: bar }) no lo tocamos aquí o lo parseamos
      // Pero asumo que no hay alias complejos.
      let [prop, alias] = v.split(':').map(s => s.trim());
      let varName = alias || prop;
      let prefix = i === 0 ? '' : indent;
      return `${prefix}const ${varName} = use${storeName}Store(s => s.${prop});`;
    }).join('\n');
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
    modifiedFiles++;
  }
});

console.log(`Refactored ${modifiedFiles} files.`);
