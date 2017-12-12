const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config')
const db = require('mongoose',{useMongoClient:true})
const app = express();

/* Connect to database */
db.connect(config.db,()=>{
	console.log('Connected to database.')
})

/* Routes */
const index = require('./routes/index');
const users = require('./routes/users');
const api = require('./routes/api')(db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* Checking for database */
app.use((req, res, next)=>{
	const databaseConnnectionMissing = db.isConnected
	if(databaseConnnectionMissing){
	  const err = new Error('no database connection found');
	  err.status = 500;
	  next(err);
	}
	next()
});

app.use('/', index);
app.use('/api', api);
app.use('/users', users);


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