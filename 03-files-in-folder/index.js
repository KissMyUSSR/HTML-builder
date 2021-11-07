const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, {withFileTypes: true}).then((data, err) => {
  if (err) throw err;

  data.filter(d => d.isFile()).forEach(d => {
    fs.stat(path.join(folderPath, d.name), (err, stats) => {
      if (err) throw err;
      
      console.log(d.name.replace('.', ' - ') + ' - ' + (stats.size / 1024).toFixed(2) + 'kb');
    });
  });
});
