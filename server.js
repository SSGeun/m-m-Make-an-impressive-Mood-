var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var express = require('express');
var config = require('./server/configure');
var app = express();

app.set('port', process.env.PORT || 3300);

app = config(app);

app.use(express.static(__dirname + '/public'));
console.log(__dirname);

// Database 연결 정보
var connectURI = 'mongodb://localhost:27017/make_an_impressive_mood';

// Database 연결
mongoose.connect(connectURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Connected Successful!'))
.catch((err) => console.log(err));

var server = app.listen(app.get('port'), function() {
    console.log('Server up: http://localhost:' + app.get('port'));
});

app.get('/', function(req, res) {

    res.send('Hello World!!');
});
