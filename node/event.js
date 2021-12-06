const events = require('events');

const emitter = new events.EventEmitter();

emitter.on('speak', ({ message }, user = 'who') => {
    console.log( `${user} Speak: ${message}`);
})

emitter.emit('speak', { message: 'holy shit!' });
