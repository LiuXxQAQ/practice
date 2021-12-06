const fs = require('fs');

const text = `This a test .`

fs.writeFile('../file/text.md', text.trim(), err => {
    if (err) {
        throw err
    }
    console.log('saved file');
})
