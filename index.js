const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app= express();
require('dotenv').config();
app.use(cors())
app.use(express.json())
console.log(process.env.DB_USER)
// const stripe = require("strip")(process.env.STRIPE_SECRATE)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywgnkn8.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const database=client.db('FlowByte')
      
        const userCollection=database.collection('userCollection');
       
     
      

        app.post('/users',async(req,res)=>{
            const user=req.body;
            const result=await userCollection.insertOne(user)
            res.send(result)

        })



        app.post('/create-payment-intent',async(req,res)=>{
            const booking = req.body;
            const price = booking.price;
            const amount = price * 100;
            const paymentIntent = await stripe.paymentIntents.create({
                currency:'usd',
                amount:amount,
                "payment_method_types":[
                    "card"
                ]
            });
            res.send({
                clientSecret:paymentIntent.client_secret
            })

        })

    }
    catch{

    }

}
run().catch(console.log)

app.get('/',async(req,res)=>{
    res.send('runnig')
})
app.listen(port,()=>{
    console.log(port)
})