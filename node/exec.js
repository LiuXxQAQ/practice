const cp = require('child_process')
const { stderr } = require('process')

cp.exec('node -v', (err, data, stderr) => {
    if (stderr) {
        console.log(stderr);
    }
    console.log(data);
})