require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { PORT, DATABASE_URL } = process.env;

const app = express();
/////////////////////////
// Models Section
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection
  .on("open", () => console.log("You are connected to mongoose"))
  .on("close", () => console.log("You are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String,
})  

const Cheese = mongoose.model("Cheese", CheeseSchema)

///////////////////////////
// Register Middleware
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

///////////////////////////
// Controllers Section

app.get("/", (req, res) => {
  res.send("Cheese API");
});

// All Cheese
app.get('/cheese', async (req, res) => {
    try{
res.json(await Cheese.find({}))
    }catch(error){
res.status(400).json(error)
    }
})

// Create Route
app.post("/cheese", async (req, res) => {
    try{
res.json(await Cheese.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

// Update Route
app.put('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Delete Route
app.delete('/cheese/:id', async (req, res) => {
    try {
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Show Route
app.get("/cheese/:id", async (req, res) => {
    try {
        res.json(await Cheese.findById(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
})

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
