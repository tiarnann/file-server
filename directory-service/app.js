const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const config = require('./config')
const fileServerApi = require('./services/file-server-api')(config.fileServers,fetch)
const mongoose = require('mongoose',{useMongoClient:true})
const db = mongoose.connection

// /* Connect to database */
// db.connect('',()=>{
// 	console.log('Connected to database.')
// })

/* Models */
const fileModel = require('./models/file')(mongoose)

/* Routes */
const apiRoutes = require('./routes/api')(express, fileModel, fileServerApi)

const app = express();

/* Middleware */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Checking for database */
// app.use((req, res, next)=>{
// 	const databaseConnnectionMissing = db.isConnected
// 	if(databaseConnnectionMissing){
// 		const err = new Error('no database connection found');
// 	  	err.status = 500;
// 	 	next(err);
// 	}
// 	next()
// });

/* Mapping routes */
app.use('/api', apiRoutes);

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
