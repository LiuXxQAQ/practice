/**
 * A single Demo about Vue3
 */

const effectStack = []

// 添加副作用函 = 
function effect(fn) {
    // 如果fn中用到了响应式数据， 当数据发生变化，fn会再次执行

    const eff = function () {
        try {
            effectStack.push(eff)
            fn()
        } finally {
            effectStack.pop()
        }
    }

    eff()

    return eff
}

// 依赖收集
// {target: {key: [eff]}}
const targetMap = {}

function track(target, key) {
    const effect = effectStack[effectStack.length - 1]
    if (effect) {
        let map = targetMap[target]

        if (!map) {
            map = targetMap[target] = {}
        }
        let deps = map[key]

        if (!deps) {
            deps = map[key] = []
        }

        if (deps.indexOf(effect) === -1) {
            deps.push(effect)
        }
    }
}

function trigger(target, key) {
    const map = targetMap[target]
    if (map) {
        const deps = map[key]
        if (deps) {
            deps.forEach(dep => dep())
        }
    }
}



const Vue = {

    createApp(options) {
        //浏览器平台
        const renderer = Vue.createRenderer({
            querySelector(selector) {
                return document.querySelector(selector)
            },
            insert(child, parent, anchor) {
                parent.insertBefore(child, anchor || null)
            }
        })
        return renderer.createApp(options)
    },
    createRenderer({ querySelector, insert }) {
        return {
            createApp(options) {
                return {
                    mount(selector) {
                            const parent = querySelector(selector)


                            if (!options.render) {
                                options.render = this.compile(parent.innerHTML)
                            }

                            if (options.setUp) {
                                this.setUpState = options.setUp()
                            } else {
                                this.data = options.data()
                            }

                            this.proxy = new Proxy(this, {
                                set(target, key, value) {
                                    if (key in target.setUpState) {
                                        target.setUpState[key] = value
                                    } else {
                                        target.data[key] = value
                                    }
                                },
                                get(target, key) {
                                    if (key in target.setUpState) {
                                        return target.setUpState[key]
                                    } else {
                                        return target.data[key]
                                    }
                                }
                            })

                            this.update = effect(() => {
                                const el = options.render.call(this.proxy)

                                parent.innerHTML = ''
                                // 将el插入parent
                                // parent.appendChild(el)
                                insert(el, parent)
                            })

                            this.update()

                    },
                    compile(template) {

                        return function render() {
                            
                            const h3 = document.createElement('h3')

                            h3.innerText = this.title

                            return h3
                        }
                    }
                }
            }
        }
    },
    reactive(obj) {
        return new Proxy(obj, {
            set(target, key, value) {
                target[key] = value
    
                // 触发trigger函数
                trigger(target, key)
            },
            get(target, key) {
                // 触发依赖收集函数
                track(target, key)
                return target[key]
            }
        })
    }
};