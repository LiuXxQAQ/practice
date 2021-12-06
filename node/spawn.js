const cp = require('child_process')

const questionApp = cp.spawn('node', ['-v']);

questionApp.stdout.on('data', data => {
    console.log(data);
})