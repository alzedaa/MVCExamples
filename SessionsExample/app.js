const express = require('express');
const app = express();

// include the express-session package
const session = require('express-session')

// Use the session middleware
// - By default session data is kept in memory, using a "session store" (i.e.
//   a way of storing session data) that is not intended for production
//   (by design).  We would normally use a different session store... e.g. a
//   session store that stores session data in a database.
// - The session secret is a key used for encrypting our cookies, for testing
//   purposes it can be something simple, but in production we would want to
//   use something like a long randomly generated string
// - Resave forces the session to be saved back to the session store, even
//   if the session was never modified during the request.  This might matter
//   if we used a session store where race conditions between multiple
//   requests could cause issues... for our purposes we can set it to false.
// - Forces a session that is "uninitialized" to be saved to the store... this
//   can actually matter if we're trying to comply with cookie laws, but for
//   our purposes this doesn't matter, and we can set it to false.
app.use(session({secret: 'keyboard cat'
                ,resave: false
                ,saveUninitialized:false}))


app.get('/', function(req, res) {

  // if the req.session.views key exists, increment the view count and send
  // back the view count to the user
  if (req.session.views) {
    req.session.views++;
    res.send('<p>views: ' + req.session.views + '</p>')
  }
  // if the req.session.views key does not yet exist, it must be the first
  // time the page had been loaded... initialize the views count to 1, and
  // tell the user to try refereshing the page...
  else {
    req.session.views = 1
    res.send('Welcome to the session demo, refresh the page!')
  }
});


app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

var server = app.listen(3000, function() {console.log("Server listening...");})
