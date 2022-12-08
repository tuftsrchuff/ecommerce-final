const { MongoClient, ServerApiVersion } = require('mongodb');
var ObjectId = require('mongodb').ObjectId; 
const uri = "mongodb+srv://ryan_huffnagle:1234pass@cluster0.yhziz6d.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function getOrders(username){
  var orders = [];
  try {
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('orders');

    //Need to specify username
    const curs = coll.find({username:username});
    // print a message if no documents were found
    if ((await curs.count()) === 0) {
      console.log("No documents found!");
    }
    //await curs.forEach(console.dir);
      await curs.forEach(function(item){
          orders.push(item);
      });
  }  // end try 
  catch(err) {
      console.log("Database error: " + err);
  }
  finally {
    client.close();
    return orders;
  }
}

async function getItems(demographic, categories){
  console.log("Demographic: " + demographic + ". Category " + categories);
  var items = [];
  try {
    console.log("Trying to connect to DB.");
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('items');
    var curs;
    for(i = 0; i < categories.length; i++){
      var demString = `'${demographic}'`;
      var catString = `'${categories[i]}'`;
      console.log(`coll.find({demographic: ${demString}, category: ${catString}}).limit(4)`);

       curs = coll.find({demographic: demographic, category: categories[i]}).limit(4);
        // print a message if no documents were found
        if ((await curs.count()) === 0) {
          console.log("No documents found!");
        }
        //await curs.forEach(console.dir);
      await curs.forEach(function(item){
        console.log(item);
          items.push(item);
      });
    }
    
  }  // end try 
  catch(err) {
      console.log("Database error: " + err);
  }
  finally {
    client.close();
    return items;
  }
}

async function getFeaturedItems(){
  var items = [];
  try {
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('items');
    const curs = coll.find({featured: 1});
    // print a message if no documents were found
    if ((await curs.count()) === 0) {
      console.log("No documents found!");
    }
    //await curs.forEach(console.dir);
      await curs.forEach(function(item){
          items.push(item);
      });
  }  // end try 
  catch(err) {
      console.log("Database error: " + err);
  }
  finally {
    client.close();
    return items;
  }
}

async function validLogin(username, password){
  var success;
  try {
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('users');

    var queryResult = await coll.findOne({username: username, password: password});
    if(queryResult !== null){
      console.log(username, password);
      console.log(queryResult);
      success = 1;
    } else {
      success = 0;
    }
  }
    catch(err){
      console.log("Database error: " + err);
    }
    finally {
      await client.close();
      return success;
    }
}

async function registerUser(first, last, paddr, CC, email, username, password){
  //Check if username already exists in DB
  var success;
  try {
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('users');

    var queryResult = await coll.findOne({username: username});
    if(queryResult !== null){
      success = 0;
    } else {
      const doc = {
        first: first,
        last: last,
        paddr: paddr,
        CC: CC,
        email: email,
        username: username,
        password: password
      }
      const result = await coll.insertOne(doc);
      console.log("Document inserted with id " + result.insertedId);
      success = 1;
    }

    
  }  // end try 
  catch(err) {
      console.log("Database error: " + err);
  }
  finally {
    await client.close();
    return success;
  }

  //If not, add entry for user and return success

  
}

async function getCartItems(items){
  o_id = [];
  items.forEach(function(item){
    o_id.push(new ObjectId(item))
});
  var retItems = [];
  console.log(items);
  try {
    console.log(o_id);
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('items');
    const curs = coll.find( { _id : { $in : o_id } } );
    // print a message if no documents were found
    if ((await curs.count()) === 0) {
      console.log("No documents found!");
    } else {
      //await curs.forEach(console.dir);
      await curs.forEach(function(item){
        retItems.push(item);
      });
    }
    
  }  // end try 
  catch(err) {
      console.log("Database error: " + err);
  }
  finally {
    client.close();
    return retItems;
  }

}

async function logOrder(cart, user, date, trees, total){
  var success;
  try {
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('orders');
    const doc = {
      username: user['username'],
      items: cart,
      date: date,
      trees: trees,
      total: total
    }
    const result = await coll.insertOne(doc);
    console.log("Document inserted with id " + result.insertedId);
    success = 1;
  } catch(err){
    console.log("Database error: " + err);
    success = 0;
  }
  finally {
    await client.close();
    return success;
  }
}

async function getUserInfo(username){
  var user;
  try {
    await client.connect();
    var dbo = client.db("ecommerce_data");
    var coll = dbo.collection('users');

    var user = await coll.findOne({username: username});
  }
    catch(err){
      console.log("Database error: " + err);
    }
    finally {
      await client.close();
      return user;
    }
}

module.exports = { getItems, getOrders, registerUser, validLogin, getFeaturedItems, getCartItems, logOrder, getUserInfo };
