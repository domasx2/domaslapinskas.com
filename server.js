import express from 'express';
import compression from 'compression';

const sections = new Set(['about', 'skills', 'open-source']);

let app = express();

app.use(compression());
app.use('/', express.static('dist'));
app.get('/:name', (req, res, next) => {
    if (sections.has(req.params.name)) {
        res.sendFile('dist/index.html');
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