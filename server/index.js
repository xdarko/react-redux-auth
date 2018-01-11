const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { errorHandlerMiddleware } = require('./utils/error-handlers');

const router = require('./router');

const app = express();
const port = process.env.PORT || 3090;

// Connect to DB
mongoose.connect('mongodb://admin:123456@ds247327.mlab.com:47327/react-redux-auth');
mongoose.connection.on('error', (err) => console.error(`🚫🚫🚫 → ${err.message}`));

// Setup middlewares
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));

// Setup routing
router(app);

// Middleware for error handing
app.use(errorHandlerMiddleware);

// Run server
const server = http.createServer(app);
server.listen(port, () => console.log(`Server listening on port ${port}`));
