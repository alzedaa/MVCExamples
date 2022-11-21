const express = require('express');
const session = require('express-session')
const mustacheExpress = require('mustache-express');

const app = express();

app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

const getStuff = function (req, res, next) {
  let newDate = new Date().toString();
  let newPath = req.path;
  let newIP = req.ip;
  let newQ = JSON.stringify(req.query);
  let newBod = JSON.stringify(req.body);
  let newString = `${newDate} ${newPath} ${newIP} ${newQ} ${newBod}\n`;

  const fs = require('fs');

  fs.appendFile('log.txt', newString, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  next();
}

// We use the .urlencoded middleware to process form data in the request body,
// which is something that occurs when we use a POST request.
app.use(express.urlencoded({extended: false}));

// Use the session middleware
app.use(session({secret: 'keyboard cat'
                ,resave: false
                ,saveUninitialized:false
                }))

app.use(getStuff)



// Login page
app.get('/login', function(req, res) {

  // The login page may need to display an error from a previous login attempt,
  // for example because the username/password doesn't exist or because the
  // form data was invalid, etc.
  // - set loginerror to error message (possibly blank)
  // - set blank the session variable keeping track of login errors
  loginerror = req.session.login_error;
  req.session.login_error = "";

  // if no user is logged in, display the login page, possibly with an error
  if (!req.session.user)
  {
    res.render("loginpage", {errormsg: loginerror});
  }
  // If a user IS logged in, we don't want them to be able to see the login
  // page (you can't be logged in 2x), so redirect them to the members page
  else
  {
    res.redirect("/members");
  }

});

// Attempts to log the user in
app.post('/attemptlogin', function(req, res) {

  // The middleware gives us a JSON object in req.body with the keys/values
  // of the form inputs.
  console.log(req.body);

  // We can check the username and password are valid before allowing the user
  // to view the members page. In a normal web app, this would involved
  // querying a database of users.
  if (req.body.username == "bob" &&
      req.body.password == "test")
  {
    // set a session variable to indicate that a user is logged in, set it to
    // who is logged in, in this case, "bob"
    req.session.user = req.body.username;

    // re-direct the user to the members page
    res.redirect("/members");
  }
  // if the input was not valid, re-render the login page with an error message
  else
  {
    req.session.login_error = "Invalid username and/or password!";
    res.redirect("/login");
  }

});

// Members page
app.get("/members", function(req,res) {

  // if no user is not logged-in, re-direct them to the login page
  if (!req.session.user) {
    res.redirect("/login");
  }
  else
  {
    // otherwise, render the members page, say hi to the user that is logged in
    res.render("members",
               {username: req.session.user});
  }
})

// Logout action
app.get('/logout', function(req, res) {

  // remove the user session key (effectively logs the user out since this is
  // how our app recognizes whether someone is logged in)
  delete(req.session.user);

  // redirect the user to the login page
  res.redirect("/login");
});

app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

var server = app.listen(3000, function() {console.log("Server listening...");})
