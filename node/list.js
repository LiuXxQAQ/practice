const fs = require('fs');

const file = fs.readdirSync('../file');

console.log(file)
console.log('Finished')


fs.readdir('../file', (err, files) => {
    if (err) {
        throw err
    }
    console.log(files);
})

console.log('Start read file...')