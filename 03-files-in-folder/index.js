const { readdir } = require('fs/promises');
const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');

// Нагромоздил слегка...
readdir(folderPath, {withFileTypes: true}).then(data => 
  data.filter(d => d.isFile()).forEach(d => {
    fs.stat(path.join(folderPath, d.name), (err, stats) => {
      if (err) throw err;
      console.log(d.name.replace('.', ' - ') + ' - ' + (stats.size / 1024).toFixed(3) + 'kb');
    });
  }));
