import express from 'express';
import compression from 'compression';
import snapshots from 'express-crawler-snapshots';

const sections = new Set(['about', 'resume', 'open-source']);

let app = express();
app.set('view engine', 'jade');
app.use(compression());
app.use('/', express.static('dist'));

let snapshots_middleware = snapshots({
    attempts: 2,
    maxPageLoads: 10,
    timeout: 10000
});

app.get('/:page?', snapshots_middleware, (req, res, next) => {
    let page = req.params.page || 'about';
    if (sections.has(page)) {
        res.render('index', {
            development: process.env.NODE_ENV == 'development'
        });
    } else {
        next();
    }
});
app.get('/*', (req, res) => {
    res.status(404).send('Nothing to see here :(');
});

let server = app.listen(process.env.NODE_ENV == 'development' ? 8000 : 80, () => {
  let address = server.address();
  console.log(`Listening at http://${address.address}:${address.port}`);
});
export default server;