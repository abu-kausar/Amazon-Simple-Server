const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yaj4j7v.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const product = client.db("emaJohn").collection("products")

        app.get("/products", async(req, res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {}
            const cursor = product.find(query)
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await product.estimatedDocumentCount();
            res.send({count, products});
        });

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => new ObjectId(id));
            const query = {_id: {$in: objectIds}};
            const cursor = product.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    }
    finally{

    }
}
run().catch(error=>console.error(error));

app.get('/', (req, res) => {
    res.send('running')
})

app.listen(port, () => {
    console.log('listening on port')
})