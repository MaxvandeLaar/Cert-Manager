const path = require('path');
const Loki = require('lokijs');

function getPlugins(){
    return new Promise((resolve, reject) => {
        const db = new Loki('ExpressPlugableRoutes');
        db.loadDatabase({}, function() {
            const plugins = db.getCollection("plugins");
            if (plugins){
                resolve(plugins.data);
            }
            resolve([]);
        });
    });
}

module.exports = async function(req, res, next) {
    const _render = res.render;
    const plugins = await getPlugins();
    res.render = function(view, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        } else if (!options) {
            options = {};
        }
        const pathRegex = /(\/[^\/\?]*){1}/;
        const matchPath = req.originalUrl.match(pathRegex);
        const reqPath = matchPath[0]?matchPath[0]:req.originalUrl;

        Object.assign(options, {
            plugins: plugins,
            path:reqPath
        });

        if (!options.navigation){
            options.navigation = `<div class="empty-top-bar"></div>`;
        }
        if (!options.title){
            options.title = "";
        }

        _render.call(this, view, options, callback);
    };
    next();
};