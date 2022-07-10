const fs = require('fs')

fs.renameSync('./file/color.md', './file/colors.md');


fs.rename('./file/test.md', '../cavans/test.md', err => {
    if (err) {
        throw err;
    }
})

// setTimeout(() => {
//     fs.unlinkSync('../cavans/test.js')
// }, 4000)
