'use strict';

const express = require('express');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
uuidv4();
const pino = require('pino');
const pinoExpress = require('express-pino-logger');

// run npm i <package name>
const hpropagate = require('hpropagate');
hpropagate();
const logger = pino({
  level: process.env.LOG_LEVEL || 'info'
});
const loggerExpress = pinoExpress(logger);
var PropertiesReader = require('properties-reader');
var isAlive = true
var isReady = true
// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';
const hostname = os.hostname();
const config = process.env.CONFIG;
var properties;
//const version = PropertiesReader('config/version.ini').get('main.version');
const version = process.env.VERSION || 'v1'
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}/version`
logger.info('BACKEND URL: ' + BACKEND_URL);
//App
const app = express();
// set log
app.use(loggerExpress);

// Main Function
app.get('/', (req, res) => {
  if (!isAlive || !isReady)
    res.status(503).send(
      `Frontend version:${version}, Response:503, Message: Backend is stopped`
    );
  else {
    var protocol = 'http';
    var body = '';
    if (BACKEND_URL.startsWith('https')) protocol = 'https';
    const https = require(protocol);
    const callback = function(response) {
        response.on('data', function (chunk) {
          body += chunk;
        });    
        response.on('end', function () {
          res.status(response.statusCode).send(
                `Frontend version: ${version} => [Backend: ${BACKEND_URL}, Response: ${response.statusCode}, Body: ${body}]`
              );
        });
    }
    var client = https.request(BACKEND_URL, callback);
    client.on('error', error => {
      logger.error(error);
      res.status(503).send(
        `Frontend version:${version}, Response:503,Host:${hostname}, Message: ${error}`
      );
    });
    client.end();
  }
});

// app.get('/metrics', (req, res) => {

//   res.set('Content-Type', prom.register.contentType);
//   res.status(200).send(prom.register.metrics());
//   logger.info('Get Application metrics');
// });


app.get('/stop', (req, res) => {
  isAlive = false;
  res.status(200).send(
    `Frontend version:${version}, Response:200, Message:set ${hostname} is stopped`
  );
  logger.info('App is stopped working');
});

app.get('/start', (req, res) => {
  isAlive = true;
  res.status(200).send(
    `Frontend version:${version}, Response:200, Message:set ${hostname} is started`
  );
  logger.info('App is started');
});

app.get('/not_ready', (req, res) => {
  isReady = false;
  res.status(200).send(
    `Frontend version:${version}, Response:200, Message:set ${hostname} is set to not ready state`
  );
  logger.info('App is set to not ready state');
});

app.get('/ready', (req, res) => {
  isReady = true;
  res.status(200).send(
    `Frontend version:${version}, Response:200, Message:set ${hostname} is set to ready state`
  );
  logger.info('App is set to ready state');
});


app.get('/health/live', (req, res) => {
  var status = 200;
  if (isAlive == false) {
    status = 503;
  } 
  logger.info(`Ready=${isReady} Live=${isAlive}`);
  res.status(status).send(
    `Frontend version:${version}, Response:${status}, Message:Ready=${isReady} Live=${isAlive}`
  );
});

app.get('/health/ready', (req, res) => {
  var status = 200;
  if (isReady == false) {
    status = 503;
  } 
  logger.info(`Ready=${isReady} Live=${isAlive}`);
  res.status(status).send(
    `Frontend version:${version}, Response:${status}, Message:Ready=${isReady} Live=${isAlive}`
  );
});

app.get('/health', (req, res) => {
  var status = 200;
  if (isReady == false || isAlive == false) {
    status = 503;
    
  }
  logger.info(`Ready=${isReady} Live=${isAlive}`);
  res.status(status).send(
    `Frontend version:${version}, Response:${status}, Message: Ready=${isReady} Live=${isAlive}`
  );
});

app.get('/version', (req, res) => {
  res.status(200).send(
    `Frontend version:${version}, Response:200, Meessage:${hostname}`
  );
  logger.info('App is stopped working');
});


app.listen(PORT, HOST);
logger.info(`Running on http://${HOST}:${PORT}`);
