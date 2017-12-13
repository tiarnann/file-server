const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('./config')
const fileServerApi = require('./services/file-server-api')(config.fileServerIp, fetch)
const mongoose = require('mongoose')
const db = mongoose.connection
mongoose.Promise = global.Promise

// Redis //
/*const redis = require("redis");
const {redisOptions} = config
const client = redis.createClient(redisOptions);
redis.debug_mode = true;*/


// Connect to database //
mongoose.connect('mongodb://localhost:27017/file-server-test')
.then(()=>{
	console.log('Connected to database.')
})
.catch(()=>{
	console.log('Error occurred while connecting to database.')
})

// Models //
const accessControlModel = require('./models/access-control')(mongoose)
const fileModel = require('./models/file')(mongoose)


// Routes //
const filesRoutes = require('./routes/files')(express, fileModel, accessControlModel, fileServerApi)
const accessControlRoutes = require('./routes/access-control')(express, fileModel, accessControlModel)
const app = express();

// Middleware //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Decrypt middleware //
const {secret} = config
const verifyAndDecrypt = require('../lib/authentication/server-client-authentication')(secret,['127.0.0.1'])
app.use(verifyAndDecrypt)

// 
/* Attach redis */
// app.use((req,res, next)=>{req.redis = client;next()})
/* Mapping routes */
app.use('/api', filesRoutes);
app.use('/api', accessControlRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports=app