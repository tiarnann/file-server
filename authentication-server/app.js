const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

/*
  Store driver setup
 */
const config = require('./config')
const redis = require('redis')
const sessionsStore = require('./middleware/sessions')(config.redis)

/*
  Database driver setup
 */
const mongoose = require('mongoose')
mongoose.Promise = global.Promise



/* Connect to database */
mongoose.connect(config.db,()=>{
	console.log('Connected to database.')
})


// Setting sessionsStore for each req
app.use(sessionsStore)

/* Routes */
const serverIdentitySecrets = config['identity-secrets']
const api = require('./routes/api')(mongoose,serverIdentitySecrets);

// view engine setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* Checking for database */
// app.use((req, res, next)=>{
// 	const databaseConnnectionMissing = db.isConnected
// 	if(databaseConnnectionMissing){
// 	  const err = new Error('no database connection found');
// 	  err.status = 500;
// 	  next(err);
// 	}
// 	next()
// });

app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;