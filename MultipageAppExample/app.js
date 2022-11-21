const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');

app.engine("mustache", mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Note that our Mustache templates are a modified version of this example
// found on w3Schools: https://www.w3schools.com/css/css_website_layout.asp


// render the home page
// - notice how we set the template boolean homenav to true... this tells
// the navigation template that we want the home navigation item to be
// highlighted when the home page is selected.  We do the same for the other
// pages as well.
app.get("/", function(req, res)
{
  res.render("home",
             {homenav: true});
});

// render the articles page... give it content for the articles
// - notice in the articles mustache template we use {{{ content }}}
// to output the content... this outputs the string as HTML rather
// than text, so we can put things like p tags in our content.
app.get("/articles", function(req, res)
{
  res.render("articles",
             {articlesnav: true
              ,articles:
               [{title: "You won't believe what happens next"
                ,content: "<p>One paragraph</p><p>Next paragraph</p>"},
                {title: "Number 7 will blow your mind"
                 ,content: "<p>One paragraph</p><p>Next paragraph</p>"},
                {title: "What he did next will leave you in tears"
                 ,content: "<p>One paragraph</p><p>Next paragraph</p>"},
                {title: "Ten reasons you should start today"
                ,content: "<p>One paragraph</p><p>Next paragraph</p>"},
              ]});
});

// render the contact page
app.get("/contact", function(req, res)
{
  res.render("contact",
             {contactnav: true});
});


app.get(/^(.+)$/, function(req,res) {
  res.sendFile(__dirname + req.params[0]);
});

var server = app.listen(3000, function() {console.log("Server listening...");})
