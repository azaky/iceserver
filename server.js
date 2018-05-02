const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('./config');
const logger = require('./logger');

const {db, addAudiences, addPoll, addInterests, getColor} = require('./firebase');

const app = express();

const expressLogger = (req, res, next) => {
    logger.info(`[REQUEST LOGGER] ${req.method} ${req.url} with request header ${JSON.stringify(req.headers)} and body ${JSON.stringify(req.body)}`);
    next();
};

const jsonErrorHandler = (error, req, res, next) => {
    if (error instanceof SyntaxError) {
        res.status(400).json({ message: 'Invalid JSON' });
    } else {
        next();
    }
};

const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};

const unhandled500 = (error, req, res, next) => {
    logger.error('Uncaught error: ', error);
    res.status(500).json({ message: 'Internal server error' });
};

app.use(cors);
app.use(bodyParser.json());
app.use(jsonErrorHandler);
app.use(expressLogger);
app.use(unhandled500);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'IceServer API' });
});

app.post('/audience', (req, res) => {
    addAudiences(req.body).then(id => {
        res.status(200).json({ id });
    }).catch(err => {
        logger.error('POST /audience:', err);
        res.status(500).json({ error: err });
    })
});

app.post('/poll', (req, res) => {
    addPoll(req.body.id, req.body.options).then(() => {
        res.status(200).json({ message: 'success' });
    }).catch(err => {
        logger.error('POST /poll:', err);
        res.status(500).json({ error: err });
    });
});

app.post('/interest', (req, res) => {
    addInterests(req.body.id, req.body.options).then(() => {
        res.status(200).json({ message: 'success' });
    }).catch(err => {
        logger.error('POST /interest:', err);
        res.status(500).json({ error: err });
    });
});

app.get('/color/:color', (req, res) => {
    getColor(req.params.color).then(color => {
        res.status(200).json({ color });
    }).catch(err => {
        logger.error('GET /color:', err);
        res.status(500).json({ error: err });
    });
});

const port = config.server.port;
http.createServer(app).listen(port, () => {
    logger.info(`iceserver started on ${port}`);
});

// Check certs for https
if (config.server.https && config.server.https.cert && fs.existsSync(config.server.https.cert)) {
    const httpsPort = config.server.https.port;
    const httpsConfig = {
        cert: fs.readFileSync(config.server.https.cert),
        key: fs.readFileSync(config.server.https.key),
        ca: config.server.https.ca && fs.readFileSync(config.server.https.ca),
    };
    https.createServer(httpsConfig, app)
        .listen(httpsPort, () => {
            logger.info(`https: azaky/express-template started on ${httpsPort}`);
        });
}

// https test endpoint
app.get('/https', (req, res) => {
    if (!req.secure) {
        return res.status(404).send(`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <title>Error</title>
                </head>
                <body>
                    <pre>Cannot GET /https</pre>
                </body>
            </html>`);
    }
    return res.status(200).json({ message: 'This endpoint is only available through secure connection' });
});