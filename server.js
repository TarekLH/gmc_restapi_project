//Requirements
const mongoose = require('mongoose');
const express = require('express');


//Mongoose models
const userModel = require('./models/user');


//Environement variables
require('dotenv').config({ path: './config/.env' });


//Database connection
const mongoAtlasUri = process.env.MONGO_URI;
try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        mongoAtlasUri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log(" Mongoose is connected"),
    );
} catch (e) {
    console.log(`Could not connect Mongoose ${e}`);
}

const dbConnection = mongoose.connection;
dbConnection.on("error", (err) => console.log(`Connection error: ${err}`));
dbConnection.once("open", () => console.log("Connected to MongoDB Atlass!"));


//Init express
const server = express();


//Routes handlers
//* RETURN ALL USERS 
server.get('/users', function getUsers(req, res) {
    try {
        userModel.find({})
        .then((datas) => {
            res.send(datas);
            console.log(datas);
        })
        .catch((err) => {
            console.log(err);
            throw new Error(err);
        })
    } catch (err) {
        res.send(err.message);
    }
});

//* ADD NEW USER
server.post('/signUp', function addUser(req, res) {
    try {
        const newUser = new userModel(req.query);
        newUser.save()
        .then((datas) => {
            console.log(datas);
            if (datas.acknowledged === false) { throw new Error("Incorrect Schema !") };
            res.send("New User Added !");
        })
        .catch((err) => {
            res.send(err.message);
        })
    } catch (err) {
        res.send(err.message);
    }
})

//* EDIT A USER BY ID
server.put('/updateprofile', function updateUser(req, res) {
    let id = req.query.id;
    let reqFirstName = req.query.firstName;
    let reqLastName = req.query.lastName;
    let reqAge = req.query.age;
    let reqEmail = req.query.email;
    console.log(id)
    try {
        userModel.findByIdAndUpdate(
            id,
            {firstName: reqFirstName, lastName: reqLastName, age: reqAge, email: reqEmail},
            {returnDocument: 'after'}
        )
        .then((datas) => {
            console.log(datas);
            if (datas.acknowledged === false) { throw new Error('Incorrect Schema !') };
            res.send('Profile Updated !');
        })
        .catch((err) => {
            res.send(err.message);
        });
    } catch (err) {
        res.send(err.message);
    }
})

//* REMOVE A USER BY ID
server.delete('/deleteprofile', function deleteUser(req, res){
    let id = req.query.id;
    try {
        userModel.findByIdAndRemove(id)
        .then((datas) => {
            res.send('Profile Deleted !');
            console.log(datas);
        })
        .catch((err) => {
            console.log(err);
            throw new Error(err);
        })
    } catch (err) {
        res.send(err.message)
    }
})


//Listen on port
const PORT = process.env.PORT //5000
server.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))
