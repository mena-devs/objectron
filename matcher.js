const match = (payload, pattern) => {
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

                value.forEach((element, index) => {
                    if(element instanceof RegExp){
                        const matcher = payload[key][index].match(element) || [];

                        if (matcher.length > 0) {
                            result = { ...result, ...matcher.groups};
                        } else {
                            result.match = false;
                        }
                        
                    } else if (element instanceof Object) {
                        tester(payload[key][index], element);
                    } else if(!payload[key].includes(element)){
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

    return result;
}

const scenario_7 = () => {

    const payload = {
        "type": "message",
        "text": "invite (Omar) (o@o.o) (foo) (batata)",
        "foo": { a: 1},
    }

    const result = match(payload, {
        "type": "message",
        "text": /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
        "foo": { a: 1},
    }) 

    return JSON.stringify({
        match: true,
        total: 2,
        matches: {
            "type": "message",
            "text": "invite (Omar) (o@o.o) (foo) (batata)",
            "foo": { a: 1},
        },
        groups: {
            name: 'Omar',
            email: 'o@o.o',
            company: 'foo',
            role: 'batata'
        }
    }) == JSON.stringify(result);

}

const scenario_6 = () => {
    const payload = {
        "type": "message",
        "text": "invite (Omar) (o@o.o) (foo) (batata)",
        "blocks": [
            {
                "number": 1,
                "bool": true,
                "items": ['ping ayman', 'hi bassem', 'sup yo']
            },{
                "number": 1,
                "bool": true,
                "some": "ping mafsoum"
            }
        ]
    }

    const result = match(payload, {
        "type": "message",
        "text": /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
        "blocks": [
            {
                "number": 1,
                "bool": true,
                "items": [/ping (?<name_other>\S+)/, /hi (?<another>\S+)/, /sup yo/ ]
            },{
                "number": 1,
                "bool": true,
                "some": /ping (?<who>.*)/
            }
        ]
    }) 

    return JSON.stringify({
        match: true,
        name: 'Omar',
        email: 'o@o.o',
        company: 'foo',
        role: 'batata',
        name_other: 'ayman',
        another: 'bassem',
        who: "mafsoum"
    }) == JSON.stringify(result);
}

const scenario_5 = () => {
    const payload = {
        "type": "message",
        "items": ['ping ayman', 'hi bassem', 'sup yo']
    }

    const result = match(payload, {
        "type": "message",
        "items": [/ping (?<name>\S+)/, /hi (?<another>\S+)/, /sup yo/ ]
    }) 

    return JSON.stringify({
        match: true,
        name: 'ayman',
        another: 'bassem'
    }) == JSON.stringify(result);
}

const scenario_4 = () => {
    const payload = {
        "type": "message",
        "items": [true, 'hi', 2, 3]
    }

    const result = match(payload, {
        "type": "message",
        "items": [true, 'hi', 2, 3]
    }) 

    return JSON.stringify({
        match: true
    }) == JSON.stringify(result);
}

const scenario_3 = () => {
    const payload = {
        "type": "message",
        "items": [0, 1, 2, 3]
    }

    const result = match(payload, {
        "type": "message",
        "items": [0, 1, 3]
    }) 

    return JSON.stringify({
        match: true
    }) == JSON.stringify(result);
}

const scenario_2 = () => {
    const payload = {
        "type": "message",
        "text": "invite (Omar) (o@o.o) (foo) (batata)",
        "blocka": {
            "number": 1,
            "bool": true,
            "blockb": {
                "a": 1,
                "b": true,
                "foo": "hug me"
            }
        }
    }

    const result = match(payload, {
        "type": "message",
        "text": /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
        "blocka": {
            "number": 1,
            "bool": true,
            "blockb": {
                "a": 1,
                "b": true,
                "foo": /hug (?<who>.*)/
            }
        }
    }) 

    return JSON.stringify({
        match: true,
        total: 7,
        matches: {
            type: 'message',
            text: 'invite (Omar) (o@o.o) (foo) (batata)',
            "blocka": {
                "number": 1,
                "bool": true,
                "blockb": {
                    "number": 1,
                    "bool": true,
                    "foo": "hug me"
                }
            }
        },
        groups: {
            name: 'Omar',
            email: 'o@o.o',
            company: 'foo',
            role: 'batata',
            who: "me"
        }
    }) == JSON.stringify(result);
}


const scenario_1 = () => {

    const payload = {
        "type": "message",
        "text": "invite (Omar) (o@o.o) (foo) (batata)",
    }

    const result = match(payload, {
        "type": "message",
        "text": /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
    }) 

    return JSON.stringify({
        match: true,
        total: 2,
        matches: {
            "type": "message",
            "text": "invite (Omar) (o@o.o) (foo) (batata)",
        },
        groups: {
            name: 'Omar',
            email: 'o@o.o',
            company: 'foo',
            role: 'batata'
        }
    }) == JSON.stringify(result);

}

const scenario_0 = () => {

    const payload = {
        "type": "message",
        "text": "text",
        "int": 1,
        "bool": true,
        "float": 1.1,
    }

    const result = match(payload, {
        "type": "message",
        "text": "text",
        "int": 1,
        "bool": true,
        "float": 1.1,
    }) 

    return JSON.stringify({
        match: true,
        total: 5,
        matches: {
            "type": "message",
            "text": "text",
            "int": 1,
            "bool": true,
            "float": 1.1,
        },
        groups: {}
    }) == JSON.stringify(result);

}

module.exports = {
    tests: {
        scenario_0,
        scenario_1,
        scenario_2,
//        scenario_3,
//        scenario_4,
//        scenario_5,
//        scenario_6,
        scenario_7,
    }
}
