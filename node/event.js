const events = require('events');

const emitter = new events.EventEmitter();

emitter.on('speak', ({ message }, user = 'Who') => {
    console.log( `${user} Speak: ${message}`);
})

emitter.emit('speak', { message: 'holy shit!' });
