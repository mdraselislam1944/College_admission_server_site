const express=require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://summer-school-site:8zCDlFYQCcluSQ7M@cluster11.cpm08j1.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const AllProductsCollection=client.db('MRGOVTCOLLEGEDB').collection('mrgovtcollege');
    app.post("/addCollege",async(req,res)=>{
      const data=req.body;
      const result=await AllProductsCollection.insertOne(data);
      res.send(result);
    })
    app.get('/showCollege',async(req,res)=>{
      const result=await AllProductsCollection.find().limit(3).toArray();
      res.send(result);
    })
    app.get('/college',async(req,res)=>{
      const result=await AllProductsCollection.find().toArray();
      res.send(result);
    })
    app.get('/individual/:id',async(req,res)=>{
      const id=req.params.id;
      const result=await AllProductsCollection.findOne({_id:new ObjectId(id)});
      res.send(result);
    })

    app.get("/colleges/:individualCollege", async (req, res) => {
      const collegeName = req.params.individualCollege;
      try{
        const result = await AllProductsCollection.find({ collegeName: { $regex: new RegExp(collegeName, 'i') } }).toArray();
        res.send(result);
      } catch{
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
      }
    });


    const studentInformation=client.db("MRGOVTCOLLEGEDB").collection("studentInformation");
    app.post("/studentsAdd",async(req,res)=>{
      const data=req.body;
      const result=await studentInformation.insertOne(data);
      res.send(result);
    })
    app.get("/studentsClass/:email",async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const result=await studentInformation.find(query).toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {

    res.send('server is running');
  })
  app.listen(port, () => {
    console.log(`The server port number is ${port}`);
  })
  
  