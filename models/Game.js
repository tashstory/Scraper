var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var GameSchema = new Schema({
  
  title: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },
 
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
  
});

// This creates our model from the above schema, using mongoose's model method
var Game = mongoose.model("Game", GameSchema);

// Export the Article model
module.exports = Game;
