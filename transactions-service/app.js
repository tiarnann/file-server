const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const config = require('./config')
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

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/* Getting all dependencies and injecting them */
const transactionModel = require('./models/transaction')(mongoose)
const shadowFileModel = require('./models/shadow-file')(mongoose)
const fileModel = require('./models/file')(mongoose)
const transactionsDeps = [express, transactionModel, shadowFileModel, fileModel]

/* Assigning routes */
const transactionsRoutes = require('./routes/transactions')(...transactionsDeps)
app.use('/api', transactionsRoutes);

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
  res.send('error');
});

module.exports = app;
