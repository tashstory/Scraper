const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require("body-parser");
const path = require('path');
const logger = require('morgan');
const mongoose = require("mongoose");


const app = express();
const PORT = process.env.PORT || 8080;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraperData"
mongoose.connect(MONGODB_URI)
const db = mongoose.connection

db.on('error', err => console.log(`Mongoose connection error: ${err}`))
// view engine setup
db.once('open', () => console.log(`Connected to MongoDB`))
 
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./routes/html-routes')
app.use('/', routes)



app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of `ycombinator`
  request("https://www.gamestop.com/deals", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("div.product").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("div.product_name_system").children("h3.product_title").text();
      var link = "https://www.gamestop.com" +  $(element).children("div.product_image").children("a").attr("href");
    var price =  $(element).children("div.product_pricing").children("div.product_pricing_info").children("p.price").text(); 
    
     console.log(title)
    console.log(link)
    console.log(price)
    
     // If this found element had both a title and a link
      if (title && link && price) {
        console.log("insertion")
        // Insert the data in the scrapedData db
    if(db.scrapedData.find())
        db.scrapedData.insert({
          title: title,
          price: price,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
         //   console.log(inserted + "okay");
          }
        });
      }
      
    });
    
  });

  // Send a "Scrape Complete" message to the browser

  
});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
