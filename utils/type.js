const Type = {};

for (let i = 0, type; type = ['String', 'Array', 'Number'][i++];) {
    Type[`is${type}`] = function(obj) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`;
    }
}

export default Type;