const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const userName = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
// mongoDB Operation

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

    // database collection
    const craftsCollection = client.db("craftDB").collection("crafts");
    const craftCategoryCollection = client
      .db("craftDB")
      .collection("craftCategory");
    const askQuestionCollection = client
      .db("craftDB")
      .collection("frequentlyAskQuestion");

    // get craft items
    app.get("/crafts", async (req, res) => {
      const cursor = await craftsCollection.find().toArray();

      res.send(cursor);
    });

    //get specific data with user email

    app.get("/my-crafts", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { email };
      }
      const cursor = await craftsCollection.find(query).toArray();

      res.send(cursor);
    });

    // get specific 6 craft for home page showing items
    app.get("/crafts/some-data", async (req, res) => {
      const cursor = await craftsCollection.find().toArray();
      const result = cursor.slice(0, 6);
      res.send(result);
    });

    // get single craft item
    app.get("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const craft = await craftsCollection.findOne(query);
      res.send(craft);
    });

    // post craft items
    app.post("/crafts", async (req, res) => {
      const craftItem = req.body;
      const result = await craftsCollection.insertOne(craftItem);
      res.send(result);
    });

    // update craft item
    app.put("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const {
        craftName,
        shortDescription,
        email,
        userName,
        price,
        rating,
        imageURL,
        subcategory_name,
        stockStatus,
        customization,
        processingTime,
      } = req.body;
      // filter which will be update by id
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      // update doc for update in database
      const updateCraft = {
        $set: {
          craftName,
          shortDescription,
          email,
          userName,
          price,
          rating,
          imageURL,
          subcategory_name,
          stockStatus,
          customization,
          processingTime,
        },
      };
      // update to database
      const result = await craftsCollection.updateOne(
        filter,
        updateCraft,
        option
      );
      res.send(result);
    });

    // delete item data from database

    app.delete("/craft/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(query);
      res.send(result);
    });

    // craft category collection get data from database

    app.get("/craft-categories", async (req, res) => {
      const cursor = await craftCategoryCollection.find().toArray();
      res.send(cursor);
    });

    // get category match craft data

    app.get("/craft-category/:category", async (req, res) => {
      const category = req.params.category;

      const query = { subcategory_name: category };
      const result = await craftsCollection.find(query).toArray();
      res.send(result);
    });

    // get Frequently Ask Question data from database

    app.get("/ask-questions", async (req, res) => {
      const result = await askQuestionCollection.find().toArray();
      res.send(result);
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
