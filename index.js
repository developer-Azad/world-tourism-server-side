const express = require('express');
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

//middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aymnc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        const database = client.db('worldTour');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');
        const allOrdersCollection = database.collection('allOrders');
        const hotelCollection = database.collection('hotels');

        //GET API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET API for hotels
        app.get('/hotels', async(req, res) => {
            const cursor = hotelCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET ORDERS API
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        //GET Manage ALLORDERS API
        app.get('/allOrders', async(req, res) => {
            const cursor = allOrdersCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET single service
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            console.log(('service id ', id));
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        //POST API
        app.post('/services', async(req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);

            console.log('got new service', req.body);
            console.log('added user', result);
            res.json(result);
        });

        //POST API for orders
        app.post('/orders', async(req, res) => {
            const order = req.body;
            console.log('orders', order);
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        })

        //POST API for manage all orders
        app.post('/allOrders', async(req, res) => {
            const order = req.body;
            console.log('orders', order);
            const result = await allOrdersCollection.insertOne(order);
            res.json(result);
        })

        //  update api for orders
      app.put('/orders/:id', async(req, res) => {
        const id = req.params.id;
        const updatedOrder = req.body;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
          $set: {
            status: updatedOrder.status
          },
        };
        const result = await ordersCollection.updateOne(filter, updateDoc, options)
        console.log('updated user', req);
        res.json(result);
      })

        //  update api for all orders
      app.put('/allOrders/:id', async(req, res) => {
        const id = req.params.id;
        const updatedOrder = req.body;
        const filter = {_id: ObjectId(id)};
        const options = {upsert: true};
        const updateDoc = {
          $set: {
            status: updatedOrder.status
          },
        };
        const result = await allOrdersCollection.updateOne(filter, updateDoc, options)
        console.log('updated user', req);
        res.json(result);
      })


        //DELETE API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            console.log('deleted user with id : ', result);
            res.json(result);
        })

        //DELETE API for orders
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            console.log('deleted user with id : ', result);
            res.json(result);
        })

        //DELETE API for manage all orders
        app.delete('/allOrders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await allOrdersCollection.deleteOne(query);
            console.log('deleted user with id : ', result);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism server is running');
})

app.listen(port, () => {
    console.log('Running Tourism server at', port);
})