var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request")
// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraperData");

var url = "mongodb://localhost/scraperData";
 
// create a client to mongodb


// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  
  mongoose.connection.db.dropDatabase();
  console.log("in")
  var games = {}
 
  request('https://www.gamestop.com/deals', function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
console.log(html)

    // Now, we grab every h2 within an Game tag, and do the following:
    $('div.product').each(function(i,element)  {
      
      games.title =  $(element).children("div.product_name_system").children("h3.product_title").text();
      games.link = "https://www.gamestop.com/" +  $(element).children("div.product_image").children("a").attr("href");
      console.log(games)
      games.price = "$15"// $(element).children("div.product_pricing").children("div.product_pricing_info").children("p.price").text(); 
      games.image =" https://www.gamestop.com/"+  $(element).children("div.product_image").children("a").children("img").attr("src");
      console.log(games.price)
    
      db.Game.create(games)
  .then(function() {
    // View the added result in the console
    console.log(scraperdata);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    return res.json(err);
  });
      // Create a new Game using the `result` object built from scraping
     
  });
  
  })
  
// If we were able to successfully scrape and save an Game, send a message to the client
res.send("Scrape Complete");
});

// Route for getting all Games from the db
app.get("/Games", function(req, res) {
  // Grab every document in the Games collection
  db.Game.find({})
    .then(function(scraperdata) {
      // If we were able to successfully find Games, send them back to the client
      res.json(scraperdata);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    
});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
