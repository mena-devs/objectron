const match = (payload, pattern, callback) => {
    let result = { match: true, total: 0, matches: {}, groups: {}};
    let node = result.matches;

    const tester = (payload, pattern, current_node) => {

        Object.entries(pattern).forEach(([key, value]) => {
            if(value instanceof RegExp){
                const matcher = payload[key].match(value) || [];
                if (matcher.length > 0) {
                    result.groups =  {...result.groups, ...matcher.groups};
                    current_node[key] = payload[key];
                    result.total += 1;
                } else {
                    result.match = false;
                }
            } else if (value instanceof Array) {
                current_node[key] = [];
                value.forEach((element, index) => {
                    if(element instanceof RegExp){
                        const matcher = payload[key][index].match(element) || [];
                        if (matcher.length > 0) {
                            result.groups = { ...result.groups, ...matcher.groups};
                            current_node[key] = payload[key];
                            result.total += 1;
                        } else {
                            result.match = false;
                        }
                    } else if (element instanceof Object) {
                        current_node[key][index] = {};
                        tester(payload[key][index], element, current_node[key][index]);
                    } else if (payload[key].includes(element)) {
                        current_node[key][index] = element;
                        result.total += 1;
                    } else {
                        result.match = false;
                    }
                });
            } else if (value instanceof Object) {
                current_node[key] = {};
                tester(payload[key], value, current_node[key]);
            } else {
                if (payload[key] != value){
                    result.match = false;
                } else {
                    current_node[key] = payload[key];
                    result.total += 1;
                }
            }
        })
    }

    tester(payload, pattern, node);

    if(callback && result.match){
        callback(result);
    }

    return result;
}

module.exports = match;
