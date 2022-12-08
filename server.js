const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mongo = require('./mongo.js');

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());

server.use('/resources', express.static(__dirname + '/resources'));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


server.listen(port);

//Serve HTML files to browser
server.get('/', async (request, response) =>{
    response.sendFile(__dirname + '/index.html');
});

server.get('/orders', async (request, response) =>{
    response.sendFile(__dirname + '/orders.html');
});

server.get('/mens', async (request, response) =>{
    response.sendFile(__dirname + '/mens.html');
});

server.get('/womens', async (request, response) =>{
    response.sendFile(__dirname + '/womens.html');
});

server.get('/kids', async (request, response) =>{
    response.sendFile(__dirname + '/kids.html');
});

server.get('/checkout', async (request, response) =>{
    response.sendFile(__dirname + '/checkout.html');
});

server.get('/login', async (request, response) =>{
    response.sendFile(__dirname + '/login.html');
});

server.get('/register', async (request, response) =>{
    response.sendFile(__dirname + '/register.html');
});

server.get('/confirmation', async (request, response) =>{
    response.sendFile(__dirname + '/confirmation.html');
});

server.get('/sustainability', async (request, response) =>{
    response.sendFile(__dirname + '/sustainability.html');
});

server.get('/header', async (request, response) =>{
    response.sendFile(__dirname + '/header.html');
});

server.get('/footer', async (request, response) =>{
    response.sendFile(__dirname + '/footer.html');
});

//Data calls for API endpoints
server.get('/api/orders', async (request, response) =>{
    var retOrders = await mongo.getOrders(request.query['username']);
    response.json(retOrders);
});

server.get('/api/items', async (request, response)=>{
    console.log("items");
    var retItems = await mongo.getItems(request.query['demographic'], request.query['categories']);
    response.json(retItems);
});

server.get('/api/items/featured', async (request, response)=>{
    console.log("featured");
    var retItems = await mongo.getFeaturedItems();
    response.json(retItems);
});

server.post('/api/login', async (request, response)=>{
    var validLogin = await mongo.validLogin(request.body['username'], request.body['password']);

    var retJSON = {
        success: validLogin
    }

    response.json(retJSON);
});

server.post('/api/register', async (request, response)=>{
    console.log("register");
    var result = await mongo.registerUser(request.body['first'], request.body['last'], request.body['paddr'], request.body['CC'], request.body['email'], request.body['username'], request.body['password']);

    var retJSON = {
        success: result
    }

    response.json(retJSON);
});

//Checkout needed
server.get('/api/checkout', async (request, response)=>{
    console.log("checkout ret items");
    var retItems = await mongo.getCartItems(request.query['items']);
    response.json(retItems);
});

server.get('/api/checkout/userInfo', async (request, response)=>{
    console.log("checkout user info");
    var retUser = await mongo.getUserInfo(request.query['username']);
    response.json(retUser);
});

server.post('/api/checkout', async (request, response)=>{
    console.log("checkout ret items");
    var retStatus = await mongo.logOrder(request.body['cart'], request.body['user'], request.body['orderDate'], request.body['trees'], request.body['total']);
    console.log(retStatus);
    response.json(retStatus);
});


server.listen(8080, ()=>{
    console.log("Listening on port 8080.");
});