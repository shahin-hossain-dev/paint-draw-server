const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
// mongoDB Operation

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${userName}:${password}@cluster0.kdwhpbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post("/craft-items", (req, res) => {
      const craftItem = req.body;
      console.log(craftItem);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Paint Draw Server is Running");
});

app.listen(port, () => {
  console.log(`Paint Draw Server is Running Port on ${port}`);
});
