const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const babelify = require(path.resolve('middleware/babelify'));
const layoutVars = require(path.resolve('middleware/layoutVars'));
const expressLayouts = require('express-ejs-layouts');
const i18n = require('i18n');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const ExpressPlugableRoutes = require('express-plugable-routes');

const app = express();
require('express-async-await')(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.set("layout extractStyles", true);
i18n.configure({
    locales: ['nl', 'en'],
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'nl',
    cookie: 'language',
    queryParameter: 'lang',
    api: {
        __: 'i18n',  // now req.__ becomes req.t
        __n: 'i18ns' // and req.__n can be called as req.tn
    },
    objectNotation: true
});
app.use(i18n.init);

// app.set("layout extractScripts", true);
app.use(layoutVars);
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', babelify(`${__dirname}/public/javascripts`, babelify.browserifySettings, {presets: ['@babel/preset-env']}));
app.use('/libs/jquery', express.static(path.resolve('node_modules/jquery/dist/jquery.js')));
app.use('/libs/foundation', express.static(path.resolve('node_modules/foundation-sites/dist')));
app.use('/libs/awesome', express.static(path.resolve('node_modules/@fortawesome/fontawesome-free/js/all.js')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

function error404 (req, res, next){
    next(createError(404));
}

// catch 404 and forward to error handler
app.use(error404);

// error handler
function errorHandler (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
}

app.use(errorHandler);

new ExpressPlugableRoutes(app, `${__dirname}/addons`, `${__dirname}/addons/**/package.json`, {depth:1, ignored: /^\./, persistent: true}, error404, errorHandler);

process.on('unhandledRejection', error => {
    // Will print "unhandledRejection err is not defined"
    console.error(error);
});
module.exports = app;
