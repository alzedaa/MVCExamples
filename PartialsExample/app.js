const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');

app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.get("/test", function(req, res)
{
  res.render("test",
             {somekey: "some value",
              boolkey1: true,
              boolkey2: false,
              somearray: ["A", "B", "C"]
             });
});

app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

var server = app.listen(3000, function() {console.log("Server listening...");})
