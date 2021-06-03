require("dotenv").config();
const mongoose = require('mongoose')
const express = require("express");

mongoose.connect('process.env.DB_CONNECT')
const app = express();
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', console.log.bind(console, 'Successfully opened connection to Mongo!'));
//These lines are always at the top

const myMiddleware = (request, response, next) => {
  // do something with request and/or response
  console.log(request.method, request.path);
    next(); // tell express to move to the next middleware function
};

//convert string JSON to JavaScript Object
app.use(express.json())
app.use(myMiddleware);

app.route("/")
  .get((request, response) => {
  response.send("HELLO WORLD");
  })
  .post((request, response) => {
  response.json(request.body);
  });

  //contract of the data
  const pizzaSchema = new mongoose.Schema({
    crust: String,
    cheese: String,
    sauce: String,
    toppings: [String]
  });
  //convert chema a model with CRUD operators
  const Pizza = mongoose.model('Pizza', pizzaSchema)
  //create route (post)
  app.post('/pizzas', (request, response) => {
    const newPizza = new Pizza(request.body)
    newPizza.save((err, pizza) => {
      return err ? response.sendStatus(500).json(err) : response.json(pizza)
    })
  })

app.route("/pizzas/:id").get((request, response) => {
  // express adds a "params" Object to requests
  const id = request.params.id;
  // handle GET request for post with an id of "id"
  response.status(418).json({
    id: id
  });
});

app.route("/**").get((request, response) => {
  response.status(404).send("NOT FOUND");
});

//This line is always LAST
const PORT = process.env.PORT || 4040;
app.listen(PORT, () => console.log("Listening on port 4040"));

