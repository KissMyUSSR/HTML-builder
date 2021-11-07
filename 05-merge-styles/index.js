const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.access(folderPath, e => { if (e) throw e; });
fs.writeFile(bundlePath, '', () => bundle(folderPath, bundlePath));

function bundle() {
  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const filePath = path.join(folderPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        
        if (stats.isFile() && path.extname(filePath) === '.css') {
          console.log('Copying: ' + filePath);

          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) throw err;

            fs.appendFile(bundlePath, data + '\n', e => { if (e) throw e;});
          });
        }
      });
    });
  });
}
