const { readdir, mkdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files_copy');

fs.access(folderPath, e => { if (e) throw e; });

fs.access(copyPath, err => {
  if (!err) fs.writeFile(copyPath, '', ()=>{
    recurCopy(folderPath, copyPath);
  });
  else recurCopy(folderPath, copyPath);
});

function recurCopy(fPath, cPath) {
  mkdir(cPath);
  readdir(fPath)
    .then(files => files.forEach(file => {
      fs.stat(path.join(fPath, file), (err, stats) => {
        if (err) throw err;
        if (!stats.isFile()) return recurCopy(path.join(fPath, file), path.join(cPath, file));
        fs.copyFile(path.join(fPath, file), path.join(cPath, file), (e)=>{if (e) throw e; });
      });
    }));
}
