const { readdir, mkdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files_copy');

fs.access(folderPath, e => { if (e) throw e; });

fs.access(copyPath, err => {
  if (!err) fs.rm(copyPath, { recursive: true, force: true }, err => {
    if (err) throw err;
    recurCopy(folderPath, copyPath);
  });
  else recurCopy(folderPath, copyPath);
});

function recurCopy(fPath, cPath) {
  mkdir(cPath)
    .then((files, err) => {
      if (err) throw err;
      
      readdir(fPath)
        .then((files, err) => files.forEach(file => {
          if (err) throw err;

          fs.stat(path.join(fPath, file), (err, stats) => {
            if (err) throw err;

            if (!stats.isFile()) return recurCopy(path.join(fPath, file), path.join(cPath, file));

            fs.copyFile(path.join(fPath, file), path.join(cPath, file), (e)=>{ if (e) throw e; });
          });
        }));
    });
}
