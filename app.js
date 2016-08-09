var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/Company');

var Schema = new mongoose.Schema({
	_id    : String,
	name: String,
	age   : Number
});

var user = mongoose.model('emp', Schema,'emp');

/*fetching data*/

app.get('/view',function(req,res)
{
  user.find({},function(err,docs)
{
   if(err)
   {
     console.log(err)
   }
   else
     {
       res.json(docs);

     }
})
});

app.post('/search',function(req,res)
{
	user.find({'name':req.body.search},function(err,docs){
		if(err)
		{
			console.log(err);
		}
		else{
			//console.log(docs);
			res.json(docs);
			//res.end();
		}
	});
});

/*deleting data*/
app.post('/delete',function(req,res)
{
	console.log(req.body.email);
	user.remove({'_id':req.body.email},function(err,docs)
		{
			if(err)
			{
				//res.json(err);
				console.log(err);
			}
			else
			{
				console.log(docs);
				//res.json(docs);
			res.end();
			}
		});
	});

/*app.post('/deletedata/:email',function(req,res)
{
	user.findById(req.body.email).exec(
		function(err,docs)
		{
			if(err)
			{
				res.json(err);
			}
			else
			{
				user.remove(function(err)
			{
				if(err)
				{
					res.send(err);
				}
				else
				{
					res.send('deleted the record');
				}
			});
				//res.send("successfully deleted");
			}
		});
});*/




/*inserting data*/
app.post('/new', function(req, res){
	new user({
		_id    : req.body.email,
		name: req.body.name,
		age   : req.body.age
	}).save(function(err, doc){
		if(err){ /*res.json(err);*/
    console.log(err);}
		else
    {
    //res.send(JSON.stringify(doc));
      res.redirect('/view');

		//	res.writeHead(302,{'Location':'localhost:3000/view.html'});
			//res.redirect('/view.html');
    }
	});
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
