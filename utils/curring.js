export const curring = function (fn) {
    const arg = [];

    return function f(...args) {
        if (args.length === 0) {
            return fn.apply(this, arg);
        } else {
            arg.push(...args);
            return f;
        };
    }
}

// example
const cost = function(...arg) {
    let money = 0;
    for (let i = 0, m; m = arg[i++];) {
        money += m;
    }
    return money;
}

const curringCost = curring(cost);

console.log(curringCost(100)(200)(300)());




