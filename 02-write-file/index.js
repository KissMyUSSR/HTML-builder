const fs = require('fs');
const path = require('path');

let writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

process.stdout.write('Enter text to write into text.txt: ');
process.stdin.on('data', data => {
  if (String(data).trim() == 'exit') {
    console.log('See ya!');
    process.exit();
  }

  writeStream.write(String(data));
  process.stdout.write(data);
});

process.on('SIGINT', function () {
  console.log('See ya!');
  process.exit();
});
