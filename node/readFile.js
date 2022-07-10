const fs = require('fs');

// sync
const text = fs.readFileSync('./file/text.md', 'UTF-8');

console.log(text)

fs.readFile('./file/text.md', 'UTF-8', (err, text) => {
    if (err) {
        throw err
    }

    console.log(text)
})

console.log('Start read file..');