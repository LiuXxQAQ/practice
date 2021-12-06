const fs = require('fs');


if (fs.existsSync('../canvas')) {
    console.log('Directory exist.')
} else {
    fs.mkdir('../canvas', err => {
        if (err) {
            throw err
        }
    
        console.log("New directory.")
    })
}
