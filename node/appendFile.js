const fs = require('fs');

const json = {
    color: 'green',
    index: 1
}

fs.appendFile('./file/colors.md', `${json.index}: ${json.color}`, err => {
    if (err) {
        throw err
    }
})