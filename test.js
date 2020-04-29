const fs = require('fs');
const path = require('path');
const colors = require('colors');

var runTests = function() {
    console.clear();
    delete require.cache[path.resolve('./matcher.js')];
    const { tests } = require('./matcher.js');
    Object.entries(tests).forEach(([name, func]) => {
        try{ 
            if(func()){
                console.log(`${name.blue} => ${'PASS'.green}`);
            }else {
                console.log(`${name.blue} => ${'FAIL'.red}`);
            }
        } catch (err) {
            const error = err.stack.toString().split('\n').slice(0,3);
            console.log(`${name.blue} => \n    ${error.join('\n').red}`);
        }
    });
}


runTests();

fs.watchFile(path.resolve('./matcher.js'), { interval: 200 }, (event, filename) => {
    runTests();
});
