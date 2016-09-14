var fs = require('fs');
var path = require('path');

module.exports = (function () {
    var customConfigurationCallbacks = null;
    return function (callbackName) {
        if (!customConfigurationCallbacks) {
            var pathToCustomConfigurationCallbacks = path.resolve(process.cwd(), 'runpack.config.js');
            if (fs.existsSync(pathToCustomConfigurationCallbacks)) {
                customConfigurationCallbacks = require(pathToCustomConfigurationCallbacks);
            } else {
                customConfigurationCallbacks = {};
            }
        }
        if (typeof customConfigurationCallbacks[callbackName] === 'function') {
            return customConfigurationCallbacks[callbackName].apply(this, [].slice.call(arguments, 1));
        }
    };
})();
