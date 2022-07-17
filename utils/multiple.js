export const multiple = (function() {
    const cache = {};
    const caculate = function(...args) {
        let a = 1;
        for (let i = 0, n; n = args[i++];) {
            a = a * n;
        }
        return a;
    }

    return function(...args) {
        const key = args.join(',');
        if (key in cache) return cache[key];

        let a = 1;

        for(let i = 0, n; n = args[i++];) {
            a = a * n;
        }

        return cache[key] = caculate.apply(null, args);
    }
})()