const logger = {
    info: (message) => {
        console.log(message);
    },
    warning: (message) => {
        console.warn(message);
    },
    error: (message) => {
        console.error(message);
    }
}

export default logger;