var usersRoute = require('../routes/usersRoute');
var postsRoute = require('../routes/postsRoute');
var filtersRoute = require('../routes/filtersRoute');

var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var morgan = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

module.exports = function (app) {
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ 'extended': true }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // 파비콘 무시
    app.use('/favicon.ico', () => { });
    app.use(cookieParser());

    if ('development' === app.get('env')) {
        app.use(errorHandler());
    }

    app.use(usersRoute);
    app.use(postsRoute);
    app.use(filtersRoute);

    return app;
};