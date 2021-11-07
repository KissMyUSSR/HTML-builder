const path = require('path');
const fs = require('fs');
const { readdir, mkdir, readFile } = require('fs/promises');

const projectPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const htmlPath = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
const assetsPath = path.join(__dirname, 'assets');
const copyAssetsPath = path.join(__dirname, 'project-dist', 'assets');

// Check paths
fs.access(projectPath, e => { if (e) mkdir(projectPath); });
fs.access(copyAssetsPath, e => { if (e) mkdir(copyAssetsPath); });
fs.access(componentsPath, e => { if (e) throw e; });
fs.access(stylesPath, e => { if (e) throw e; });
fs.access(assetsPath, e => { if (e) throw e; });
fs.access(templatePath, e =>{ if (e) throw e; });

// Bundle styles
fs.writeFile(bundlePath, '', () => bundleStyles(stylesPath, bundlePath));
function bundleStyles(stylesPath, bundlePath) {
  fs.readdir(stylesPath, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const filePath = path.join(stylesPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        
        if (stats.isFile() && path.extname(filePath) === '.css') {
          fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) throw err;

            fs.appendFile(bundlePath, data + '\n', e => { if (e) throw e;});
          });
        }
      });
    });
  });
}

// Copy '/assets'
recurCopy(assetsPath, copyAssetsPath);
function recurCopy(aPath, cPath) {
  fs.access(cPath, err => { if (err) mkdir(cPath); });
  
  readdir(aPath)
    .then(files => files.forEach(file => {
      fs.stat(path.join(aPath, file), (err, stats) => {
        if (err) throw err;

        if (!stats.isFile()) return recurCopy(path.join(aPath, file), path.join(cPath, file));
        
        fs.copyFile(path.join(aPath, file), path.join(cPath, file), e => {if (e) throw e; });
      });
    }));
}

// Replace templates
fs.writeFile(htmlPath, '', () => insertComponents(templatePath, componentsPath, htmlPath));
function insertComponents(tPath, cPath, hPath) {
  let htmlContent = '';

  readFile(tPath, 'utf-8')
    .then((data, e) => {
      if (e) throw e;
      htmlContent += data;
    })
    .then(() => {
      fs.readdir(cPath, (e, files) => {
        if (e) throw e;

        files.forEach(file => {
          const filePath = path.join(cPath, file);
    
          fs.stat(filePath, (e, stats) => {
            if (e) throw e;
            
            if (stats.isFile() && path.extname(filePath) === '.html') {
              const fileName = file.substr(0, file.lastIndexOf('.'));
              const templateRE = new RegExp(`{{${fileName}}}`, 'g');
              let componentContent = '';
              
              readFile(filePath, 'utf-8')
                .then((data, e) => {
                  if (e) throw e;
                  componentContent += data;
                })
                .then(() => {
                  htmlContent = htmlContent.replace(templateRE, componentContent);
                  fs.writeFile(hPath, htmlContent, e => { if (e) throw e; });
                });
            }
          });
        });
      });
    });
}