const waitTime = 3000;
const waitInterval = 500;
let currentTime = 0;

const timeFinished = () => {
    clearInterval(interval);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(`done`);
}

const timer = () => {
    currentTime += waitInterval;
    const p = Math.floor((currentTime / waitTime) * 100);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`...wait ${p}%`);
}

const interval = setInterval(timer, waitInterval);
setTimeout(timeFinished, waitTime);