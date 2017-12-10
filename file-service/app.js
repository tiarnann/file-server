const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

/* Connect to database */
mongoose.connect('mongodb://localhost:27017/file-server-test')
	.then(()=>{
		console.log('Connected to database.')
	})
	.catch(()=>{
		console.log('Error occurred while connecting to database.')
	})

/* Models */
const fileModel = require('./models/file')(mongoose)

/* Routes */
const filesRoutes = require('./routes/files')(express, fileModel)
const transactionsRoutes = require('./routes/transactions')(express, fileModel)

const app = express();

/* Middleware */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Checking for database */
// app.use((req, res, next)=>{
// 	const databaseConnnectionMissing = db.isConnected
// 	if(databaseConnnectionMissing){
// 			const err = new Error('no database connection found');
// 		  	err.status = 500;
// 		 	next(err);
// 	}
// 	next()
// });

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
  res.send(err);
});

module.exports=app
