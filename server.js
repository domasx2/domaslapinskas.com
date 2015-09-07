var express = require('express'),
    compression = require('compression'),
    app = express(),
    sections = ['about', 'skills', 'open-source'];

app.use(compression());
app.use('/', express.static('dist'));
app.get('/:name', function (req, res, next){
    if (sections.indexOf(req.params.name) !== -1) {
        res.sendFile('dist/index.html');
    } else {
        next();
    }
});
app.get('/*', function(req, res) {
    res.status(404).send('Nothing to see here :(');
});

var port = process.env.NODE_ENV == 'development' ? 8000 : 80;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});