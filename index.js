const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const dataBase_User = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = `mongodb+srv://${dataBase_User}:${password}@cluster0.sopxnju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function run() {
  try {
    await client.connect();

    app.get('/listing', async (req, res) => {
      try {
        console.log(res)
        const listings = await db.collection('listing').find().toArray();
        console.log('listings', listings);
        res.status(200).json(listings);
      } catch (error) {
        console.log(error)
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
    
    app.post('/listing', async (req, res) => {
      try {
        const newListing = req.body;
        const result = await db.collection('listing').insertOne(newListing);
        console.log('New listing added', result);
        res.status(201).json(result);
      } catch (error) {
        console.error('Error adding listing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    db = client.db('airbnb'); 
    await db.command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {

  }
}

run()
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
