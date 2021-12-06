const fs = require('fs');

const readStream = fs.createReadStream('../file/text.md', 'UTF-8')
const writeStream = fs.createWriteStream('../file/test.md', 'UTF-8')

readStream.pipe(writeStream);

readStream.on('data', (data) => {
    console.log(data.length);
})

readStream.once('data', (data) => {
    console.log(data);
})

readStream.on('end', () => {
    console.log('finish');
})