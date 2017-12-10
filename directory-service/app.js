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

/* Connect to database */
mongoose.connect('mongodb://localhost:27017/file-server-test')
	.then(()=>{
		console.log('Connected to database.')
	})
	.catch(()=>{
		console.log('Error occurred while connecting to database.')
	})
// /* Connect to database */
// db.connect('',()=>{
// 	console.log('Connected to database.')
// })

/* Models */
const fileModel = require('./models/file')(mongoose)

/* Routes */
const filesRoutes = require('./routes/files')(express, fileModel, fileServerApi)

const app = express();

/* Middleware */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Auth
// const {secret} = config
// const auth = require('../lib/authentication/auth-service')
// const verifyAndDecrypt = require('../lib/authentication/server-client-authentication')(auth, secret)
// app.use(verifyAndDecrypt)

/* Mapping routes */
app.use('/api', filesRoutes);

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
