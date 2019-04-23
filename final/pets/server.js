const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/final-pets', {
  useNewUrlParser: true
});

const multer = require('multer')
const upload = multer({
  dest: './public/images',
  limits: {
    fileSize: 10000000
  }
});

const clientSchema = new mongoose.Schema({
  clientName: String,
  clientAddress: String,
  clientPhone: String,
});
const petSchema = new mongoose.Schema({
  petType: String,
  petName: String,
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'Client'}
});
const Client = mongoose.model('Client', clientSchema);
const Pet = mongoose.model('Pet', petSchema);

//find all clients
app.get('/api/clients/', async (req, res) => {
  try {
    let clients = await Client.find();
    res.send(clients);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//create a new client
app.post('/api/clients', async (req, res) => {
  if (!req.body.name || !req.body.address || !req.body.phone)
    return res.status(400).send({
      message: "You must include a Name, address, and Phone number."
    });
  const client = new Client({
    clientName: req.body.name,
    clientAddress: req.body.address,
    clientPhone: req.body.phone,
  });
  try {
    await client.save();
    res.send(client);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
app.get("/api/clients/:id/pets", async (req, res) => {

  try {
    let client = await Client.findOne({
      _id: req.params.id
   });
    let pets = await Pet.find({
      owner: client
    });
    return res.send(pets);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});
app.post("/api/clients/:id/pets", async (req, res) => {
  // check parameters
  if (!req.body.type || !req.body.name)
    return res.status(400).send({
      message: "You must include a Name and type."
    });
  let client = await Client.findOne({
    _id: req.params.id
  });
  const pet = new Pet({
    petType: req.body.type,
    petName: req.body.name,
    owner: client,
  });
  try {
    await pet.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
