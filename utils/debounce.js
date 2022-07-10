export const debounce = function(fn, wait) {
    let timeout

    return function (...arg) {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => {
            fn.apply(this, arg)
        }, wait)
    }
}

function f(fn, limit) {
    let now = 0
    return function(...arg) {
        let next = new Date().getTime()
        if (next - now > limit) {
            fn.apply(this, arg)
            now = next
        }
    }
}
